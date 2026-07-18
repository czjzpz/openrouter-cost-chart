/**
 * Brand logos fetched via Google's favicon service.
 * Each provider/creator maps to a website URL and a brand hex color.
 * The Logo component renders the favicon as an <img> inside a colored circle.
 * Falls back to null (caller uses lucide icon) when no website is known.
 */

const FAVICON_BASE = 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';

export function faviconUrl(website: string, size = 64): string {
  return `${FAVICON_BASE}${encodeURIComponent(website)}&size=${size}`;
}

interface BrandInfo {
  /** Website URL for favicon lookup */
  site: string;
  /** Brand hex color (without #) for the background circle */
  color: string;
}

const BRANDS: Record<string, BrandInfo> = {
  // ── Creators ────────────────────────────────────────────────────────
  'OpenAI':           { site: 'https://openai.com',              color: '000000' },
  'Anthropic':        { site: 'https://anthropic.com',           color: '191919' },
  'Google':           { site: 'https://google.com',              color: '4285F4' },
  'Google AI Studio': { site: 'https://aistudio.google.com',     color: '4285F4' },
  'DeepSeek':         { site: 'https://deepseek.com',            color: '5786FE' },
  'Meta':             { site: 'https://meta.com',                color: '0467DF' },
  'Mistral':          { site: 'https://mistral.ai',              color: 'FA520F' },
  'Alibaba Qwen':     { site: 'https://qwen.com',        color: '6950EF' },
  'Qwen':             { site: 'https://qwen.com',        color: '6950EF' },
  'Cohere':           { site: 'https://cohere.com',              color: '395FED' },
  'xAI':              { site: 'https://x.ai',                    color: '000000' },
  'MoonshotAI':       { site: 'https://moonshot.ai',             color: '000000' },
  'Moonshot AI':      { site: 'https://moonshot.ai',             color: '000000' },
  'Z.ai':             { site: 'https://z.ai',                    color: '2D2D2D' },
  'Z.AI':             { site: 'https://z.ai',                    color: '2D2D2D' },
  'NVIDIA':           { site: 'https://nvidia.com',              color: '76B900' },
  'Nvidia':           { site: 'https://nvidia.com',              color: '76B900' },
  'MiniMax':          { site: 'https://minimaxi.com',            color: 'E73562' },
  'Minimax':          { site: 'https://minimaxi.com',            color: 'E73562' },
  'Amazon':           { site: 'https://amazon.com',              color: 'FF9900' },
  'Amazon Nova':      { site: 'https://amazon.com',              color: 'FF9900' },
  'Microsoft':        { site: 'https://microsoft.com',           color: '00A4EF' },
  'Perplexity':       { site: 'https://perplexity.ai',           color: '1FB8CD' },
  'IBM':              { site: 'https://ibm.com',                 color: '0062FF' },
  'ByteDance':        { site: 'https://bytedance.com',           color: '3C8CFF' },
  'ByteDance Seed':   { site: 'https://bytedance.com',           color: '3C8CFF' },
  'Tencent':          { site: 'https://tencent.com',             color: '00A1E9' },
  'Xiaomi':           { site: 'https://xiaomi.com',              color: 'FF6900' },
  'StepFun':          { site: 'https://stepfun.com',             color: '1E1E2E' },
  'Kwaipilot':        { site: 'https://kwaipilot.ai',            color: '1E1E2E' },
  'Nex AGI':          { site: 'https://nexagi.com',              color: '1E1E2E' },
  'Sakana AI':        { site: 'https://sakana.ai',               color: '13448F' },
  'Nous Research':    { site: 'https://nousresearch.com',        color: '1E1E2E' },
  'Writer':           { site: 'https://writer.com',              color: '1E1E2E' },
  'Upstage':          { site: 'https://upstage.ai',              color: '1E1E2E' },
  'Inflection':       { site: 'https://inflection.ai',           color: '1E1E2E' },
  'AI21 Labs':        { site: 'https://ai21.com',                color: '1E1E2E' },
  'AI21':             { site: 'https://ai21.com',                color: '1E1E2E' },
  'Inception':        { site: 'https://inception.no',            color: '1E1E2E' },
  'Morph':            { site: 'https://morph.ai',                color: '1E1E2E' },
  'Arcee AI':         { site: 'https://arcee.ai',                color: '1E1E2E' },
  'Reka':             { site: 'https://reka.ai',                 color: '1E1E2E' },
  'Relace':           { site: 'https://relace.ai',               color: '1E1E2E' },
  'Perceptron':       { site: 'https://perceptron.ai',           color: '1E1E2E' },
  'Baidu':            { site: 'https://baidu.com',               color: '2932E1' },
  'Allen AI':         { site: 'https://allenai.org',             color: '1E1E2E' },
  'Deep Cogito':      { site: 'https://deepcogito.com',          color: '1E1E2E' },
  'TheDrummer':       { site: 'https://huggingface.co/TheDrummer', color: 'FFD21E' },
  'Sao10K':           { site: 'https://huggingface.co/sao10k',    color: 'FFD21E' },
  'Poolside':         { site: 'https://poolside.ai',             color: 'B03931' },
  'inclusionAI':      { site: 'https://inclusion.ai',            color: '1E1E2E' },
  'AionLabs':         { site: 'https://aionlabs.com',             color: '1E1E2E' },
  'OpenRouter':       { site: 'https://openrouter.ai',           color: '94A3B8' },
  'anthracite-org':   { site: 'https://huggingface.co/Anthracite-Org', color: 'FFD21E' },
  'cognitivecomputations': { site: 'https://huggingface.co/cognitivecomputations', color: 'FFD21E' },

  // ── Inference Providers ─────────────────────────────────────────────
  'Azure':            { site: 'https://azure.microsoft.com',     color: '0078D4' },
  'Amazon Bedrock':   { site: 'https://aws.amazon.com/bedrock',  color: 'FF9900' },
  'Amazon Web Services': { site: 'https://aws.amazon.com',       color: 'FF9900' },
  'DeepInfra':        { site: 'https://deepinfra.com',           color: '1E1E2E' },
  'Fireworks':        { site: 'https://fireworks.ai',            color: '1E1E2E' },
  'Together':         { site: 'https://together.ai',             color: '1E1E2E' },
  'Groq':             { site: 'https://groq.com',                color: 'F97316' },
  'Novita':           { site: 'https://novita.ai',               color: '5D87BF' },
  'Featherless':      { site: 'https://featherless.ai',          color: '1E1E2E' },
  'Recursal':         { site: 'https://recursal.com',            color: '1E1E2E' },
  'Hyperbolic':       { site: 'https://hyperbolic.xyz',          color: '1E1E2E' },
  'Lepton':           { site: 'https://lepton.ai',               color: '1E1E2E' },
  'Infermatic':       { site: 'https://infermatic.ai',           color: '1E1E2E' },
  'Lambda':           { site: 'https://lambdalabs.com',          color: '1E1E2E' },
  'Nineteen':         { site: 'https://nineteen.ai',             color: '512BD4' },
  'Chutes':           { site: 'https://chutes.ai',               color: '1E1E2E' },
  'Kluster':          { site: 'https://kluster.ai',              color: '1E1E2E' },
  'Reflection':       { site: 'https://reflection.net',          color: '1E1E2E' },
  'Liquid':           { site: 'https://liquid.ai',               color: '1E1E2E' },
  'Alibaba':          { site: 'https://alibaba.com',             color: 'FF6A00' },
  'Alibaba Cloud':    { site: 'https://alibabacloud.com',        color: 'FF6A00' },
  'SiliconFlow':      { site: 'https://siliconflow.com',         color: '1E1E2E' },
  'DigitalOcean':     { site: 'https://digitalocean.com',        color: '0080FF' },
  'Venice':           { site: 'https://venice.ai',               color: '1E1E2E' },
  'Parasail':         { site: 'https://parasail.io',             color: '276DC3' },
  'WandB':            { site: 'https://wandb.ai',                color: 'FFBE00' },
  'AkashML':          { site: 'https://akash.network',           color: 'E50010' },
  'AtlasCloud':       { site: 'https://atlascloud.io',           color: '1E1E2E' },
  'Io Net':           { site: 'https://io.net',                  color: '1E1E2E' },
  'StreamLake':       { site: 'https://streamlake.com',          color: '1E1E2E' },
  'GMICloud':         { site: 'https://gmicloud.com',            color: '1E1E2E' },
  'Ambient':          { site: 'https://ambient.ai',              color: '1E1E2E' },
  'Avian':            { site: 'https://avian.io',                color: 'FF0000' },
  'BaseTen':          { site: 'https://baseten.ai',              color: '1E1E2E' },
  'Black Forest Labs':{ site: 'https://blackforestlabs.ai',      color: '1E1E2E' },
  'Cerebras':         { site: 'https://cerebras.com',            color: '1E1E2E' },
  'Cirrascale':       { site: 'https://cirrascale.com',          color: '1E1E2E' },
  'Clarifai':         { site: 'https://clarifai.com',            color: '1955FF' },
  'Cloudflare':       { site: 'https://cloudflare.com',          color: 'F38020' },
  'Crucible':         { site: 'https://crucible.ai',             color: '1E1E2E' },
  'Crusoe':           { site: 'https://crusoe.ai',               color: '1E1E2E' },
  'Darkbloom':        { site: 'https://darkbloom.com',           color: '1E1E2E' },
  'Decart':           { site: 'https://decart.ai',               color: '1E1E2E' },
  'Deepgram':         { site: 'https://deepgram.com',            color: '13EF93' },
  'DekaLLM':          { site: 'https://dekallm.com',             color: '1E1E2E' },
  'Friendli':         { site: 'https://friendli.ai',             color: '1E1E2E' },
  'HeyGen':           { site: 'https://heygen.com',              color: '1E1E2E' },
  'Inceptron':        { site: 'https://inceptron.ai',            color: '1E1E2E' },
  'Inferact vLLM':    { site: 'https://inferact.io',             color: '1E1E2E' },
  'InferenceNet':     { site: 'https://inference.net',           color: '1E1E2E' },
  'Ionstream':        { site: 'https://ionstream.ai',            color: '1E1E2E' },
  'Mancer 2':         { site: 'https://mancer.tech',             color: '1E1E2E' },
  'Mara':             { site: 'https://mara.ai',                 color: '1E1E2E' },
  'ModelRun':         { site: 'https://modelrun.ai',             color: '1E1E2E' },
  'Modular':          { site: 'https://modular.com',             color: '1E1E2E' },
  'NCompass':         { site: 'https://ncompass.ai',             color: '1E1E2E' },
  'Nebius':           { site: 'https://nebius.ai',               color: '1E1E2E' },
  'NextBit':          { site: 'https://nextbit.ai',              color: '592EC1' },
  'OpenInference':    { site: 'https://openinference.com',        color: '1E1E2E' },
  'Phala':            { site: 'https://phala.network',           color: 'B03532' },
  'Quiver':           { site: 'https://quiver.ai',               color: '1E1E2E' },
  'Recraft':          { site: 'https://recraft.ai',              color: '1E1E2E' },
  'Sail Research':    { site: 'https://sailresearch.com',         color: '1E1E2E' },
  'SambaNova':        { site: 'https://sambanova.ai',            color: '5D87BF' },
  'Seed':             { site: 'https://bytedance.com',           color: '3C8CFF' },
  'Sourceful':        { site: 'https://sourceful.ai',            color: '1E1E2E' },
  'Stealth':          { site: 'https://stealth.ai',              color: '1E1E2E' },
  'Switchpoint':      { site: 'https://switchpoint.ai',          color: '1E1E2E' },
  'Tenstorrent':      { site: 'https://tenstorrent.com',         color: '1E1E2E' },
  'Wafer':            { site: 'https://wafer.ai',                color: '1E1E2E' },
};

/**
 * Render a brand favicon for a given creator or provider name.
 * Returns null if no website is known (caller should fall back to lucide icon).
 */
export function Logo({ name }: { name: string }) {
  const brand = BRANDS[name];
  if (!brand) return null;

  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <img
        src={faviconUrl(brand.site)}
        alt={name}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        loading="lazy"
      />
    </div>
  );
}