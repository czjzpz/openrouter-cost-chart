'use client';

import { ModelData, ModelEndpoint } from '@/lib/types';
import { formatPricePerM, formatContext } from '@/lib/openrouter';
import { getCreatorIcon, getProviderIcon } from '@/lib/icons';
import { Logo } from '@/lib/logos';
import { X, ExternalLink, Zap, DollarSign, BarChart3, Cpu, Gauge } from 'lucide-react';
import React from 'react';

interface ModelDetailProps {
  model: ModelData;
  onClose: () => void;
}

function getCheapestEndpoint(endpoints: ModelEndpoint[] | undefined) {
  if (!endpoints || endpoints.length === 0) return null;
  let best = endpoints[0];
  for (const ep of endpoints) {
    const curr = parseFloat(ep.pricing.prompt) + parseFloat(ep.pricing.completion);
    const bestVal = parseFloat(best.pricing.prompt) + parseFloat(best.pricing.completion);
    if (curr < bestVal) best = ep;
  }
  return best;
}

function getMostExpensiveEndpoint(endpoints: ModelEndpoint[] | undefined) {
  if (!endpoints || endpoints.length === 0) return null;
  let worst = endpoints[0];
  for (const ep of endpoints) {
    const curr = parseFloat(ep.pricing.prompt) + parseFloat(ep.pricing.completion);
    const worstVal = parseFloat(worst.pricing.prompt) + parseFloat(worst.pricing.completion);
    if (curr > worstVal) worst = ep;
  }
  return worst;
}

function getFastestEndpoint(endpoints: ModelEndpoint[] | undefined) {
  if (!endpoints || endpoints.length === 0) return null;
  let fastest = endpoints[0];
  for (const ep of endpoints) {
    if ((ep.throughput_last_30m ?? 0) > (fastest.throughput_last_30m ?? 0)) fastest = ep;
  }
  return fastest.throughput_last_30m ? fastest : null;
}

export function ModelDetail({ model, onClose }: ModelDetailProps) {
  const openRouterUrl = `https://openrouter.ai/${model.id}`;

  // Aggregate unique providers with their best pricing
  const providers = new Map<string, { input: number; output: number; quantization: string; throughput?: number | null }>();
  if (model.endpoints) {
    for (const ep of model.endpoints) {
      const name = ep.provider_name;
      const existing = providers.get(name);
      const input = parseFloat(ep.pricing.prompt) || 0;
      const output = parseFloat(ep.pricing.completion) || 0;
      if (!existing || input < existing.input) {
        providers.set(name, { input, output, quantization: ep.quantization, throughput: ep.throughput_last_30m });
      }
    }
  }

  const sortedProviders = [...providers.entries()].sort((a, b) => a[1].input - b[1].input);
  const cheapest = getCheapestEndpoint(model.endpoints);
  const mostExpensive = getMostExpensiveEndpoint(model.endpoints);
  const fastest = getFastestEndpoint(model.endpoints);

  // Find the min and max combined price across providers for the mini chart
  const providerPrices = sortedProviders.map(([_, p]) => p.input + p.output);
  const minCombined = providerPrices.length > 0 ? Math.min(...providerPrices) : 0;
  const maxCombined = providerPrices.length > 0 ? Math.max(...providerPrices) : 0;
  const range = maxCombined - minCombined || 1;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed top-0 left-0 h-full w-80 z-50 bg-gray-950 border-r border-[rgba(255,255,255,0.06)] animate-slide-in overflow-y-auto">
        <div className="p-4">

          {/* ── HEADER ── */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {Logo({ name: model.creator }) ??
                React.createElement(getCreatorIcon(model.creator), { className: 'w-4 h-4 text-gray-500' })}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-semibold text-gray-100 truncate">{model.name}</h2>
              <p className="text-[10px] text-gray-500 mt-0.5">{model.creator} · {model.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-300 flex-shrink-0 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── PRICING CARDS ── */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-md border border-[rgba(255,255,255,0.06)] p-2.5">
              <div className="text-[10px] text-gray-500 mb-1">Input</div>
              <div className="text-xs font-mono tabular-nums text-gray-200">
                {model.isFree ? <span className="text-green-400">Free</span> : formatPricePerM(model.avgInputPrice)}
              </div>
              {model.minInputPrice !== model.maxInputPrice && (
                <div className="text-[9px] text-gray-600 mt-0.5">
                  {formatPricePerM(model.minInputPrice)} – {formatPricePerM(model.maxInputPrice)}
                </div>
              )}
            </div>
            <div className="rounded-md border border-[rgba(255,255,255,0.06)] p-2.5">
              <div className="text-[10px] text-gray-500 mb-1">Output</div>
              <div className="text-xs font-mono tabular-nums text-gray-200">
                {model.isFree ? <span className="text-green-400">Free</span> : formatPricePerM(model.avgOutputPrice)}
              </div>
              {model.minOutputPrice !== model.maxOutputPrice && (
                <div className="text-[9px] text-gray-600 mt-0.5">
                  {formatPricePerM(model.minOutputPrice)} – {formatPricePerM(model.maxOutputPrice)}
                </div>
              )}
            </div>
          </div>

          {/* ── PROVIDER MINI CHART ── */}
          {sortedProviders.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] text-gray-500 mb-2 font-medium">Providers</div>
              <div className="space-y-1">
                {sortedProviders.map(([name, pricing]) => {
                  const combined = pricing.input + pricing.output;
                  const barWidth = ((combined - minCombined) / range) * 100;
                  const isCheapest = cheapest?.provider_name === name;
                  const isFastest = fastest?.provider_name === name;
                  return (
                    <div key={name} className="relative px-2 py-1.5 rounded-[4px] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      {/* Background bar — shows relative cost */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-[4px] bg-[rgba(59,130,246,0.06)] transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                      {/* Content */}
                      <div className="relative flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {Logo({ name }) ??
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center flex-shrink-0">
                              {React.createElement(getProviderIcon(name), { className: 'w-2 h-2 text-gray-500' })}
                            </div>}
                          <span className="text-[10px] text-gray-400 truncate">{name}</span>
                          {pricing.quantization && pricing.quantization !== 'unknown' && (
                            <span className="text-[8px] text-gray-600">{pricing.quantization}</span>
                          )}
                          {isCheapest && <Zap className="w-2 h-2 text-green-400 flex-shrink-0" />}
                          {isFastest && <Gauge className="w-2 h-2 text-blue-400 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono tabular-nums flex-shrink-0">
                          <span className="text-gray-500">{formatPricePerM(pricing.input)}</span>
                          <span className="text-gray-400">{formatPricePerM(pricing.output)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SUB-SCORES ── */}
          {(model.codingIndex !== null || model.intelligenceIndex !== null || model.avgElo !== null) && (
            <div className="mb-3">
              <div className="text-[10px] text-gray-500 mb-1.5 font-medium">Scores</div>
              <div className="space-y-1">
                {model.codingIndex !== null && (
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-gray-500 w-14 flex-shrink-0">Coding</span>
                    <div className="flex-1 h-1 bg-[rgba(255,255,255,0.06)] rounded-[2px] overflow-hidden">
                      <div className="h-full rounded-[2px] bg-[rgba(59,130,246,0.5)]" style={{ width: `${model.codingIndex}%` }} />
                    </div>
                    <span className="font-mono tabular-nums text-gray-400 w-8 text-right">{model.codingIndex.toFixed(1)}</span>
                  </div>
                )}
                {model.intelligenceIndex !== null && (
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-gray-500 w-14 flex-shrink-0">Intel.</span>
                    <div className="flex-1 h-1 bg-[rgba(255,255,255,0.06)] rounded-[2px] overflow-hidden">
                      <div className="h-full rounded-[2px] bg-[rgba(59,130,246,0.5)]" style={{ width: `${model.intelligenceIndex}%` }} />
                    </div>
                    <span className="font-mono tabular-nums text-gray-400 w-8 text-right">{model.intelligenceIndex.toFixed(1)}</span>
                  </div>
                )}
                {model.avgElo !== null && (
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-gray-500 w-14 flex-shrink-0">ELO</span>
                    <div className="flex-1 h-1 bg-[rgba(255,255,255,0.06)] rounded-[2px] overflow-hidden">
                      <div className="h-full rounded-[2px] bg-[rgba(59,130,246,0.5)]" style={{ width: `${Math.min(100, ((model.avgElo - 800) / 800) * 100)}%` }} />
                    </div>
                    <span className="font-mono tabular-nums text-gray-400 w-8 text-right">{model.avgElo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── EFFICIENCY ── */}
          <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-md border border-[rgba(59,130,246,0.08)]">
            <Cpu className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-gray-400">Efficiency</span>
            <div className="flex-1 h-1 bg-[rgba(255,255,255,0.06)] rounded-[2px] overflow-hidden">
              <div className="h-full rounded-[2px] bg-blue-400" style={{ width: `${Math.min(100, model.efficiencyScore)}%` }} />
            </div>
            <span className="text-[10px] font-mono tabular-nums text-blue-300">{model.efficiencyScore.toFixed(1)}</span>
          </div>

          {/* ── STATS STRIP ── */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 text-[10px]">
            <span className="text-gray-500">ctx <span className="text-gray-300 font-mono">{formatContext(model.context_length)}</span></span>
            <span className="text-gray-500">providers <span className="text-gray-300 font-mono">{model.providerCount}</span></span>
          </div>

          {/* ── DESCRIPTION ── */}
          {model.description && (
            <div className="mb-3">
              <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-3">{model.description}</p>
            </div>
          )}

          {/* ── ARENA BENCHMARKS ── */}
          {model.benchmarks?.design_arena && model.benchmarks.design_arena.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] text-gray-500 mb-1.5 font-medium">Arena</div>
              <div className="space-y-0.5">
                {model.benchmarks.design_arena.slice(0, 8).map((b, i) => (
                  <div key={i} className="flex items-center justify-between px-1 py-0.5">
                    <span className="text-[10px] text-gray-500 truncate mr-2">{b.category}</span>
                    <span className="text-[10px] font-mono tabular-nums text-gray-400">{b.elo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LINK ── */}
          <a
            href={openRouterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            View on OpenRouter <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </>
  );
}