'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ModelData, FilterState, SortField, SortDirection, ColumnKey, ALL_COLUMNS } from '@/lib/types';
import { fetchModels, sortModels, filterModels, getAllCreators, getAllProviders } from '@/lib/openrouter';
import { ModelTable } from '@/components/ModelTable';
import { SearchFilters } from '@/components/SearchFilters';
import { ModelDetail } from '@/components/ModelDetail';
import { ColumnsToggle } from '@/components/ColumnsToggle';

export default function Home() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [sortField, setSortField] = useState<SortField>('efficiencyScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(ALL_COLUMNS.filter(c => c.default).map(c => c.key))
  );

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    creators: [],
    providers: [],
    minContext: 0,
    maxContext: 0,
    minEfficiency: 0,
    maxEfficiency: 0,
    hideFree: false,
    hideRouters: true,
    modality: [],
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchModels();
        setModels(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load models');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSort = useCallback((field: SortField) => {
    setSortDirection(prev => sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'desc');
    setSortField(field);
  }, [sortField]);

  const toggleColumn = useCallback((key: ColumnKey) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const allCreators = useMemo(() => getAllCreators(models), [models]);
  const allProviders = useMemo(() => getAllProviders(models), [models]);

  const filtered = useMemo(() => filterModels(models, filters), [models, filters]);
  const sorted = useMemo(() => sortModels(filtered, sortField, sortDirection), [filtered, sortField, sortDirection]);

  const lastUpdated = useMemo(() => {
    if (models.length === 0) return null;
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }, [models.length]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        <p className="text-sm">Failed to load models: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header bar — tighter than before */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-1.5 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <h1 className="text-xs font-semibold tracking-tight text-gray-100">
            openrouter-cost-chart
          </h1>
          <span className="text-[10px] text-gray-600">
            {sorted.length} of {models.length}
          </span>
          {lastUpdated && (
            <span className="text-[10px] text-gray-600">· {lastUpdated}</span>
          )}
          {loading && <span className="text-[10px] text-blue-400">updating...</span>}
        </div>
        <div className="flex items-center gap-2">
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            allCreators={allCreators}
            allProviders={allProviders}
          />
          <ColumnsToggle
            visibleColumns={visibleColumns}
            onToggle={toggleColumn}
          />
        </div>
      </header>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <ModelTable
          models={sorted}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelect={setSelectedModel}
          selectedId={selectedModel?.id}
          visibleColumns={visibleColumns}
        />
      </div>

      {/* Side Panel */}
      {selectedModel && (
        <ModelDetail
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
}