'use client';

import { ColumnKey, ALL_COLUMNS } from '@/lib/types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ColumnsToggleProps {
  visibleColumns: Set<ColumnKey>;
  onToggle: (key: ColumnKey) => void;
}

export function ColumnsToggle({ visibleColumns, onToggle }: ColumnsToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300 border border-[rgba(255,255,255,0.08)] rounded-md pl-2 pr-1.5 py-1 transition-colors"
      >
        Columns <ChevronDown className="w-2.5 h-2.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-32 bg-gray-900 border border-[rgba(255,255,255,0.08)] rounded-md shadow-lg p-1">
            {ALL_COLUMNS.map(col => (
              <label
                key={col.key}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-[4px] hover:bg-[rgba(255,255,255,0.04)] cursor-pointer select-none transition-colors"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.has(col.key)}
                  onChange={() => onToggle(col.key)}
                />
                <span className="text-[11px] text-gray-400">{col.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}