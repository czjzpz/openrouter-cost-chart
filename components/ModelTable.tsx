'use client';

import React from 'react';
import { ModelData, SortField, SortDirection, ColumnKey } from '@/lib/types';
import { formatPricePerM, formatContext } from '@/lib/openrouter';
import { getCreatorIcon } from '@/lib/icons';
import { Logo } from '@/lib/logos';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface ModelTableProps {
  models: ModelData[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onSelect: (model: ModelData) => void;
  selectedId?: string;
  visibleColumns: Set<ColumnKey>;
}

const FIELD_MAP: Record<ColumnKey, SortField | null> = {
  name: 'name',
  creator: 'creator',
  providers: 'providerCount',
  minInput: 'minInputPrice',
  avgInput: 'avgInputPrice',
  medInput: 'medianInputPrice',
  minOutput: 'minOutputPrice',
  avgOutput: 'avgOutputPrice',
  medOutput: 'medianOutputPrice',
  context: 'context_length',
  efficiency: 'efficiencyScore',
  elo: 'avgElo',
  coding: 'codingIndex',
};

export function ModelTable({ models, sortField, sortDirection, onSort, onSelect, selectedId, visibleColumns }: ModelTableProps) {
  const renderHeader = (key: ColumnKey, label: string) => {
    const field = FIELD_MAP[key];
    if (!field) return null;
    const active = sortField === field;
    return (
      <th
        key={key}
        onClick={() => onSort(field)}
        className={`sticky top-0 z-10 px-2 py-1.5 text-[10px] font-medium tracking-wider text-gray-500 bg-gray-950 border-b border-[rgba(255,255,255,0.06)] cursor-pointer hover:text-gray-300 select-none whitespace-nowrap transition-colors ${
          active ? 'text-blue-400' : ''
        }`}
      >
        <div className="flex items-center gap-0.5">
          {label}
          {active && (
            sortDirection === 'asc' ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />
          )}
        </div>
      </th>
    );
  };

  const openRouterLink = (id: string) => `https://openrouter.ai/${id}`;

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {visibleColumns.has('name') && renderHeader('name', 'Model')}
            {visibleColumns.has('creator') && renderHeader('creator', 'Creator')}
            {visibleColumns.has('providers') && renderHeader('providers', 'Prov.')}
            {visibleColumns.has('minInput') && renderHeader('minInput', 'Min In')}
            {visibleColumns.has('avgInput') && renderHeader('avgInput', 'Avg In')}
            {visibleColumns.has('medInput') && renderHeader('medInput', 'Med In')}
            {visibleColumns.has('minOutput') && renderHeader('minOutput', 'Min Out')}
            {visibleColumns.has('avgOutput') && renderHeader('avgOutput', 'Avg Out')}
            {visibleColumns.has('medOutput') && renderHeader('medOutput', 'Med Out')}
            {visibleColumns.has('context') && renderHeader('context', 'Context')}
            {visibleColumns.has('efficiency') && renderHeader('efficiency', 'Eff.')}
            {visibleColumns.has('elo') && renderHeader('elo', 'ELO')}
            {visibleColumns.has('coding') && renderHeader('coding', 'Coding')}
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr
              key={model.id}
              onClick={() => onSelect(model)}
              className={`border-b border-[rgba(255,255,255,0.04)] cursor-pointer transition-colors ${
                selectedId === model.id ? 'bg-[rgba(59,130,246,0.04)]' : 'hover:bg-[rgba(255,255,255,0.02)]'
              }`}
            >
              {visibleColumns.has('name') && (
                <td className="px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    {Logo({ name: model.creator }) ??
                      <div className="w-4 h-4 rounded-[4px] bg-[rgba(255,255,255,0.04)] flex items-center justify-center flex-shrink-0">
                        {React.createElement(getCreatorIcon(model.creator), { className: 'w-2.5 h-2.5 text-gray-500' })}
                      </div>}
                    <div className="min-w-0 flex items-center gap-1">
                      <span className="text-[11px] font-medium text-gray-200 truncate max-w-[180px]">
                        {model.name}
                      </span>
                      <a
                        href={openRouterLink(model.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-gray-600 hover:text-blue-400 flex-shrink-0 transition-colors"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </td>
              )}
              {visibleColumns.has('creator') && (
                <td className="px-2 py-1.5 text-[11px] text-gray-500">{model.creator}</td>
              )}
              {visibleColumns.has('providers') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-500">{model.providerCount}</td>
              )}
              {visibleColumns.has('minInput') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-500">
                  {model.isFree ? <span className="text-green-400">Free</span> : formatPricePerM(model.minInputPrice)}
                </td>
              )}
              {visibleColumns.has('avgInput') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-300">
                  {model.isFree ? <span className="text-green-400">Free</span> : formatPricePerM(model.avgInputPrice)}
                </td>
              )}
              {visibleColumns.has('medInput') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-500">
                  {model.isFree ? <span className="text-green-400">Free</span> : formatPricePerM(model.medianInputPrice)}
                </td>
              )}
              {visibleColumns.has('minOutput') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-500">
                  {model.isFree ? <span className="text-green-400">Free</span> : formatPricePerM(model.minOutputPrice)}
                </td>
              )}
              {visibleColumns.has('avgOutput') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-300">
                  {model.isFree ? <span className="text-green-400">Free</span> : formatPricePerM(model.avgOutputPrice)}
                </td>
              )}
              {visibleColumns.has('medOutput') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-500">
                  {model.isFree ? <span className="text-green-400">Free</span> : formatPricePerM(model.medianOutputPrice)}
                </td>
              )}
              {visibleColumns.has('context') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-500">
                  {formatContext(model.context_length)}
                </td>
              )}
              {visibleColumns.has('efficiency') && (
                <td className="px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1 bg-[rgba(255,255,255,0.06)] rounded-[2px] overflow-hidden">
                      <div
                        className="h-full rounded-[2px] bg-[rgba(59,130,246,0.5)]"
                        style={{ width: `${Math.min(100, model.efficiencyScore)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-gray-500">
                      {model.efficiencyScore.toFixed(1)}
                    </span>
                  </div>
                </td>
              )}
              {visibleColumns.has('elo') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-500">
                  {model.avgElo ?? '—'}
                </td>
              )}
              {visibleColumns.has('coding') && (
                <td className="px-2 py-1.5 text-[11px] font-mono tabular-nums text-gray-500">
                  {model.codingIndex !== null ? model.codingIndex.toFixed(1) : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {models.length === 0 && (
        <div className="flex items-center justify-center py-16 text-xs text-gray-600">
          No models match your filters
        </div>
      )}
    </div>
  );
}