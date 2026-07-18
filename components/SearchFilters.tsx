'use client';

import { FilterState } from '@/lib/types';
import { Search, X } from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';

interface SearchFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  allCreators: string[];
  allProviders: string[];
}

export function SearchFilters({ filters, onChange, allCreators, allProviders }: SearchFiltersProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const hasActiveFilters = filters.creators.length > 0 || filters.providers.length > 0 ||
    filters.hideFree || filters.minContext > 0 || filters.minEfficiency > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search models..."
          value={filters.search}
          onChange={e => update({ search: e.target.value })}
          className="w-40 pl-7 pr-2 py-1 text-[11px] bg-transparent border border-[rgba(255,255,255,0.08)] rounded-md text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
        />
      </div>

      {/* Creator filter — styled dropdown */}
      <FilterDropdown
        label="Creator"
        items={allCreators}
        selected={filters.creators}
        onSelect={item => update({ creators: [...filters.creators, item] })}
        onRemove={item => update({ creators: filters.creators.filter(c => c !== item) })}
      />

      {/* Provider filter — styled dropdown */}
      <FilterDropdown
        label="Provider"
        items={allProviders}
        selected={filters.providers}
        onSelect={item => update({ providers: [...filters.providers, item] })}
        onRemove={item => update({ providers: filters.providers.filter(p => p !== item) })}
      />

      {/* Context filter */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-600">ctx</span>
        <input
          type="number"
          placeholder="min"
          value={filters.minContext || ''}
          onChange={e => update({ minContext: Math.max(0, parseInt(e.target.value) || 0) })}
          className="w-14 py-1 text-[11px] bg-transparent border border-[rgba(255,255,255,0.08)] rounded-md px-2 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
        />
        <span className="text-gray-600">–</span>
        <input
          type="number"
          placeholder="max"
          value={filters.maxContext || ''}
          onChange={e => update({ maxContext: Math.max(0, parseInt(e.target.value) || 0) })}
          className="w-14 py-1 text-[11px] bg-transparent border border-[rgba(255,255,255,0.08)] rounded-md px-2 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
        />
      </div>

      {/* Hide free */}
      <label className="flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer select-none hover:text-gray-300 transition-colors">
        <input
          type="checkbox"
          checked={filters.hideFree}
          onChange={e => update({ hideFree: e.target.checked })}
        />
        free
      </label>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={() => onChange({
            search: '', creators: [], providers: [],
            minContext: 0, maxContext: 0, minEfficiency: 0, maxEfficiency: 0,
            hideFree: false, hideRouters: true, modality: [],
          })}
          className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}