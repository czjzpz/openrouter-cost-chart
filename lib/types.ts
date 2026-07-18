export interface ModelEndpoint {
  provider_name: string;
  tag: string;
  context_length: number | null;
  pricing: {
    prompt: string;
    completion: string;
    input_cache_read?: string;
    discount?: number;
  };
  quantization: string;
  max_completion_tokens: number | null;
  status: number;
  uptime_last_30m?: number;
  latency_last_30m?: number | null;
  throughput_last_30m?: number | null;
}

export interface BenchmarkEntry {
  arena: string;
  category: string;
  elo: number;
  win_rate: number;
  rank: number;
}

export interface ArtificialAnalysis {
  intelligence_index?: number | null;
  coding_index?: number | null;
  agentic_index?: number | null;
}

export interface ModelData {
  id: string;
  name: string;
  description?: string;
  context_length: number | null;
  architecture?: { modality: string };
  pricing: Record<string, unknown>;
  top_provider?: { id: string; context_length?: number | null; max_completion_tokens?: number | null };
  per_request_limits?: number | null;
  site_url?: string;
  benchmarks?: {
    design_arena?: BenchmarkEntry[];
    artificial_analysis?: ArtificialAnalysis;
  };
  endpoints?: ModelEndpoint[];

  // Computed fields
  creator: string;
  providerCount: number;
  providerNames: string[];
  minInputPrice: number;
  minOutputPrice: number;
  avgInputPrice: number;
  avgOutputPrice: number;
  medianInputPrice: number;
  medianOutputPrice: number;
  maxInputPrice: number;
  maxOutputPrice: number;
  efficiencyScore: number;
  avgElo: number | null;
  codingIndex: number | null;
  intelligenceIndex: number | null;
  isFree: boolean;
  isRouter: boolean;
  modality: string;
}

export type SortField =
  | 'name' | 'creator' | 'providerCount'
  | 'minInputPrice' | 'minOutputPrice'
  | 'avgInputPrice' | 'avgOutputPrice'
  | 'medianInputPrice' | 'medianOutputPrice'
  | 'context_length' | 'efficiencyScore'
  | 'avgElo' | 'codingIndex';

export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  creators: string[];
  providers: string[];
  minContext: number;
  maxContext: number;
  minEfficiency: number;
  maxEfficiency: number;
  hideFree: boolean;
  hideRouters: boolean;
  modality: string[];
}

export type ColumnKey =
  | 'name' | 'creator' | 'providers'
  | 'minInput' | 'avgInput' | 'medInput'
  | 'minOutput' | 'avgOutput' | 'medOutput'
  | 'context' | 'efficiency' | 'elo' | 'coding';

export const ALL_COLUMNS: { key: ColumnKey; label: string; default: boolean }[] = [
  { key: 'name', label: 'Model', default: true },
  { key: 'creator', label: 'Creator', default: true },
  { key: 'providers', label: 'Prov.', default: true },
  { key: 'minInput', label: 'Min In', default: false },
  { key: 'avgInput', label: 'Avg In', default: true },
  { key: 'medInput', label: 'Med In', default: false },
  { key: 'minOutput', label: 'Min Out', default: false },
  { key: 'avgOutput', label: 'Avg Out', default: true },
  { key: 'medOutput', label: 'Med Out', default: false },
  { key: 'context', label: 'Context', default: true },
  { key: 'efficiency', label: 'Efficiency', default: true },
  { key: 'elo', label: 'ELO', default: false },
  { key: 'coding', label: 'Coding', default: false },
];