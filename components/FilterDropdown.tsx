'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  items: string[];
  selected: string[];
  onSelect: (item: string) => void;
  onRemove: (item: string) => void;
}

export function FilterDropdown({ label, items, selected, onSelect, onRemove }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the search input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = items.filter(i =>
    i.toLowerCase().includes(query.toLowerCase())
  );

  const selectedSet = new Set(selected);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[11px] text-gray-400 border border-[rgba(255,255,255,0.08)] rounded-md pl-2 pr-1.5 py-1 hover:text-gray-300 transition-colors"
      >
        {label}
        {selected.length > 0 && (
          <span className="ml-0.5 text-[10px] text-blue-400 font-medium">{selected.length}</span>
        )}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); setQuery(''); }} />
          <div className="absolute left-0 top-full mt-1 z-20 w-52 bg-gray-900 border border-[rgba(255,255,255,0.08)] rounded-md shadow-lg overflow-hidden">
            {/* Search within filter */}
            <div className="relative border-b border-[rgba(255,255,255,0.06)]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder={`Filter ${label.toLowerCase()}...`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-[11px] bg-transparent text-gray-200 placeholder-gray-600 focus:outline-none"
              />
            </div>

            {/* Items list */}
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-[11px] text-gray-500 text-center">
                  No matches
                </div>
              )}
              {filtered.map(item => {
                const isSelected = selectedSet.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => {
                      if (isSelected) onRemove(item);
                      else onSelect(item);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-left transition-colors ${
                      isSelected
                        ? 'text-blue-400 bg-[rgba(59,130,246,0.06)]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[rgba(255,255,255,0.02)]'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 flex items-center justify-center rounded-[3px] border transition-colors ${
                      isSelected
                        ? 'bg-blue-500/50 border-blue-400/60'
                        : 'border-[rgba(255,255,255,0.15)]'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </span>
                    <span className="truncate">{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}