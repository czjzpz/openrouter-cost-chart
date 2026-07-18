import { ModelData, ModelEndpoint, BenchmarkEntry, SortField, SortDirection, FilterState } from './types';

const MODELS_API_URL = 'https://openrouter.ai/api/v1/models';
const ENDPOINTS_API_BASE = 'https://openrouter.ai/api/v1/models';

// ── Efficiency Configuration ──────────────────────────────────────────
// Edit these values to tune how the efficiency score is calculated.
// All weights should sum to 1.0.
export const EFFICIENCY_CONFIG = {
  /** Weight of context-length-per-dollar (0-1) */
  contextWeight: 0.4,
  /** Weight of Artificial Analysis coding index (0-1) */
  codingWeight: 0.3,
  /** Weight of average Design Arena ELO score (0-1) */
  eloWeight: 0.2,
  /** Weight of Artificial Analysis intelligence index (0-1) */
  intelligenceWeight: 0.1,
};

// ── Creator Name Mapping ──────────────────────────────────────────────

const CREATOR_NAMES: Record<string, string> = {
  'openai': 'OpenAI',
  'anthropic': 'Anthropic',
  'google': 'Google',
  'deepseek': 'DeepSeek',
  'meta-llama': 'Meta',
  'meta': 'Meta',
  'mistralai': 'Mistral',
  'qwen': 'Alibaba Qwen',
  'cohere': 'Cohere',
  'x-ai': 'xAI',
  'moonshotai': 'MoonshotAI',
  'z-ai': 'Z.ai',
  'nvidia': 'NVIDIA',
  'minimax': 'MiniMax',
  'openrouter': 'OpenRouter',
  'bytedance-seed': 'ByteDance Seed',
  'bytedance': 'ByteDance',
  'amazon': 'Amazon',
  'microsoft': 'Microsoft',
  'perplexity': 'Perplexity',
  'poolside': 'Poolside',
  'inclusionai': 'inclusionAI',
  'aion-labs': 'AionLabs',
  'tencent': 'Tencent',
  'xiaomi': 'Xiaomi',
  'stepfun': 'StepFun',
  'kwaipilot': 'Kwaipilot',
  'ibm-granite': 'IBM',
  'nex-agi': 'Nex AGI',
  'sakana': 'Sakana AI',
  'nousresearch': 'Nous Research',
  'writer': 'Writer',
  'upstage': 'Upstage',
  'inflection': 'Inflection',
  'ai21': 'AI21 Labs',
  'inception': 'Inception',
  'morph': 'Morph',
  'arcee-ai': 'Arcee AI',
  'rekaai': 'Reka',
  'relace': 'Relace',
  'perceptron': 'Perceptron',
  'baidu': 'Baidu',
  'allenai': 'Allen AI',
  'deepcogito': 'Deep Cogito',
  'thedrummer': 'TheDrummer',
  'sao10k': 'Sao10K',
  'gryphe': 'Gryphe',
  'mancer': 'Mancer',
  'undi95': 'Undi95',
  'anthracite-org': 'Anthracite',
  'cognitivecomputations': 'Cognitive Computations',
};

function extractCreator(modelId: string): string {
  const parts = modelId.split('/');
  if (parts.length < 2) return 'Unknown';
  const creator = parts[0].replace(/^~/, '');
  return CREATOR_NAMES[creator] || creator.charAt(0).toUpperCase() + creator.slice(1).replace(/-/g, ' ');
}

function getModality(architecture?: { modality: string }): string {
  if (!architecture?.modality) return 'text';
  return architecture.modality;
}

function parsePrice(priceStr: string | undefined | null): number {
  if (!priceStr) return 0;
  const val = parseFloat(priceStr);
  return isNaN(val) ? 0 : val;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

// ── Format price as per-million ──────────────────────────────────────

export function formatPricePerM(price: number): string {
  if (price === 0) return 'Free';
  const perM = price * 1_000_000;
  if (perM < 0.01) return `$${perM.toFixed(4)}/M`;
  if (perM < 1) return `$${perM.toFixed(3)}/M`;
  if (perM < 100) return `$${perM.toFixed(2)}/M`;
  return `$${perM.toFixed(0)}/M`;
}

export function formatContext(ctx: number | null): string {
  if (!ctx) return '—';
  if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(0)}M`;
  if (ctx >= 1_000) return `${(ctx / 1_000).toFixed(0)}K`;
  return String(ctx);
}

// ── Main fetch function ───────────────────────────────────────────────

export async function fetchModels(): Promise<ModelData[]> {
  const res = await fetch(MODELS_API_URL, {
    next: { revalidate: 1800 }, // 30 minutes
  });
  if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);
  const json = await res.json();
  const rawModels = json.data || [];

  const models: ModelData[] = [];
  const batchSize = 5;

  for (let i = 0; i < rawModels.length; i += batchSize) {
    const batch = rawModels.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      batch.map(async (m: any) => {
        let endpoints: ModelEndpoint[] = [];
        try {
          const slug = m.canonical_slug || m.id;
          const epRes = await fetch(`${ENDPOINTS_API_BASE}/${encodeURIComponent(slug)}/endpoints`, {
            next: { revalidate: 1800 },
          });
          if (epRes.ok) {
            const epJson = await epRes.json();
            endpoints = epJson.data?.endpoints || [];
          }
        } catch {
          // endpoint fetch failed, fall back to model pricing
        }

        let prices: { prompt: number; completion: number; provider: string }[] = [];
        if (endpoints.length > 0) {
          prices = endpoints.map((ep: ModelEndpoint) => ({
            prompt: parsePrice(ep.pricing?.prompt),
            completion: parsePrice(ep.pricing?.completion),
            provider: ep.provider_name,
          }));
        } else {
          const p = (m.pricing as Record<string, unknown>) ?? {};
          const promptPrice = parsePrice(p.prompt as string);
          const completionPrice = parsePrice(p.completion as string);
          if (promptPrice >= 0 && completionPrice >= 0) {
            prices.push({
              prompt: promptPrice,
              completion: completionPrice,
              provider: ((m.top_provider as Record<string, unknown>)?.id as string) || 'Unknown',
            });
          }
        }

        const validPrices = prices.filter(p => p.prompt >= 0 && p.completion >= 0);
        const promptPrices = validPrices.map(p => p.prompt);
        const completionPrices = validPrices.map(p => p.completion);
        const providerNames = [...new Set(validPrices.map(p => p.provider))];

        const isFree = validPrices.length > 0 && validPrices.every(p => p.prompt === 0 && p.completion === 0);
        const isRouter = m.id.startsWith('openrouter/') || m.id.startsWith('~');

        const avgInputPrice = validPrices.length > 0 ? average(promptPrices) : 0;
        const avgOutputPrice = validPrices.length > 0 ? average(completionPrices) : 0;
        const contextLength = m.context_length || 0;

        // Context-length-per-dollar efficiency
        const totalPrice = avgInputPrice + avgOutputPrice;
        let contextEfficiency = 0;
        if (totalPrice > 0 && contextLength > 0) {
          contextEfficiency = contextLength / (totalPrice * 1_000_000);
        }
        const contextScore = Math.min(100, Math.log10(contextEfficiency + 1) * 20);

        // ELO scores
        const benchmarks = (m.benchmarks || {}) as any;
        const arenaEntries: BenchmarkEntry[] = benchmarks.design_arena || [];
        const avgElo = arenaEntries.length > 0 ? average(arenaEntries.map(e => e.elo)) : null;
        const artificialAnalysis = (benchmarks.artificial_analysis || {}) as any;
        const codingIndex = artificialAnalysis.coding_index ?? null;
        const intelligenceIndex = artificialAnalysis.intelligence_index ?? null;

        const codingScore = codingIndex !== null ? codingIndex : 0;
        const eloScore = avgElo !== null ? Math.min(100, (avgElo - 800) / 8) : 0;
        const intelligenceScore = intelligenceIndex !== null ? intelligenceIndex : 0;

        const efficiencyScore =
          contextScore * EFFICIENCY_CONFIG.contextWeight +
          codingScore * EFFICIENCY_CONFIG.codingWeight +
          eloScore * EFFICIENCY_CONFIG.eloWeight +
          intelligenceScore * EFFICIENCY_CONFIG.intelligenceWeight;

        return {
          id: m.id,
          name: m.name,
          description: m.description,
          context_length: m.context_length,
          architecture: m.architecture,
          pricing: m.pricing,
          top_provider: m.top_provider,
          per_request_limits: m.per_request_limits,
          benchmarks: m.benchmarks,
          endpoints,
          creator: extractCreator(m.id),
          providerCount: providerNames.length,
          providerNames,
          minInputPrice: promptPrices.length > 0 ? Math.min(...promptPrices) : 0,
          minOutputPrice: completionPrices.length > 0 ? Math.min(...completionPrices) : 0,
          avgInputPrice,
          avgOutputPrice,
          medianInputPrice: median(promptPrices),
          medianOutputPrice: median(completionPrices),
          maxInputPrice: promptPrices.length > 0 ? Math.max(...promptPrices) : 0,
          maxOutputPrice: completionPrices.length > 0 ? Math.max(...completionPrices) : 0,
          efficiencyScore: Math.round(efficiencyScore * 10) / 10,
          avgElo: avgElo !== null ? Math.round(avgElo) : null,
          codingIndex,
          intelligenceIndex,
          isFree,
          isRouter,
          modality: getModality(m.architecture),
        } as ModelData;
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        models.push(result.value);
      }
    }
  }

  return models;
}

// ── Sorting ───────────────────────────────────────────────────────────

export function sortModels(models: ModelData[], field: SortField, direction: SortDirection): ModelData[] {
  return [...models].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'name': cmp = a.name.localeCompare(b.name); break;
      case 'creator': cmp = a.creator.localeCompare(b.creator); break;
      case 'providerCount': cmp = a.providerCount - b.providerCount; break;
      case 'minInputPrice': cmp = a.minInputPrice - b.minInputPrice; break;
      case 'minOutputPrice': cmp = a.minOutputPrice - b.minOutputPrice; break;
      case 'avgInputPrice': cmp = a.avgInputPrice - b.avgInputPrice; break;
      case 'avgOutputPrice': cmp = a.avgOutputPrice - b.avgOutputPrice; break;
      case 'medianInputPrice': cmp = a.medianInputPrice - b.medianInputPrice; break;
      case 'medianOutputPrice': cmp = a.medianOutputPrice - b.medianOutputPrice; break;
      case 'context_length': cmp = (a.context_length || 0) - (b.context_length || 0); break;
      case 'efficiencyScore': cmp = a.efficiencyScore - b.efficiencyScore; break;
      case 'avgElo': cmp = (a.avgElo || 0) - (b.avgElo || 0); break;
      case 'codingIndex': cmp = (a.codingIndex || 0) - (b.codingIndex || 0); break;
    }
    return direction === 'asc' ? cmp : -cmp;
  });
}

// ── Filtering ─────────────────────────────────────────────────────────

export function filterModels(models: ModelData[], filters: FilterState): ModelData[] {
  return models.filter(m => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.creator.toLowerCase().includes(q) && !m.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filters.creators.length > 0 && !filters.creators.includes(m.creator)) return false;
    if (filters.providers.length > 0 && !m.providerNames.some(p => filters.providers.includes(p))) return false;
    if (filters.minContext > 0 && (m.context_length || 0) < filters.minContext) return false;
    if (filters.maxContext > 0 && (m.context_length || 0) > filters.maxContext) return false;
    if (filters.minEfficiency > 0 && m.efficiencyScore < filters.minEfficiency) return false;
    if (filters.maxEfficiency > 0 && m.efficiencyScore > filters.maxEfficiency) return false;
    if (filters.hideFree && m.isFree) return false;
    if (filters.hideRouters && m.isRouter) return false;
    if (filters.modality.length > 0 && !filters.modality.includes(m.modality)) return false;
    return true;
  });
}

export function getAllCreators(models: ModelData[]): string[] {
  return [...new Set(models.map(m => m.creator))].sort();
}

export function getAllProviders(models: ModelData[]): string[] {
  const providers = new Set<string>();
  models.forEach(m => m.providerNames.forEach(p => providers.add(p)));
  return [...providers].sort();
}