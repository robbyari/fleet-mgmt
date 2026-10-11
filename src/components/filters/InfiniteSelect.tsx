import React, { useEffect, useRef, useState } from 'react'
import {
  Check,
  ChevronDown,
  Loader2,
  Search,
  X,
} from 'lucide-react'

export interface SelectOption {
  id: string
  label: string
  sublabel?: string
  color?: string
  textColor?: string
  badge?: string
}

interface InfiniteSelectProps {
  label: string
  icon?: React.ReactNode
  options: SelectOption[]
  selectedValues: string[]
  onChange: (selected: string[]) => void
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
  loadingMore: boolean
  placeholder?: string
  emptyMessage?: string
}

export const InfiniteSelect: React.FC<InfiniteSelectProps> = ({
  label,
  icon,
  options,
  selectedValues,
  onChange,
  onLoadMore,
  hasMore,
  loading,
  loadingMore,
  placeholder = 'Cari...',
  emptyMessage = 'Tidak ada pilihan ditemukan',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Infinite scroll detection on list container
  const handleScroll = () => {
    if (!listRef.current || loadingMore || !hasMore) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollTop + clientHeight >= scrollHeight - 60) {
      onLoadMore()
    }
  }

  // Filter options based on local search query
  const filteredOptions = options.filter((option) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      option.label.toLowerCase().includes(q) ||
      (option.sublabel && option.sublabel.toLowerCase().includes(q)) ||
      option.id.toLowerCase().includes(q)
    )
  })

  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id))
    } else {
      onChange([...selectedValues, id])
    }
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  return (
    <div className="relative inline-block w-full" ref={containerRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border rounded-xl text-left text-sm transition shadow-xs cursor-pointer ${
          isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20'
            : selectedValues.length > 0
            ? 'border-indigo-300 bg-indigo-50/20'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <div className="truncate">
            <span className="font-medium text-slate-700">{label}</span>
            {selectedValues.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {selectedValues.length} terpilih
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedValues.length > 0 && (
            <span
              onClick={handleClearAll}
              role="button"
              tabIndex={0}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              title="Hapus filter"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full min-w-[280px] max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-500">
              <span>{options.length} item termuat</span>
              {selectedValues.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  Reset ({selectedValues.length})
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Items with Infinite Scroll */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-50"
          >
            {loading && options.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Memuat data...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.id)
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-xs transition ${
                      isSelected
                        ? 'bg-indigo-50/80 text-indigo-950 font-medium'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {/* Custom Checkbox */}
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    {/* Color indicator if present */}
                    {option.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: `#${option.color.replace('#', '')}` }}
                      />
                    )}

                    {/* Option Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{option.label}</span>
                        {option.badge && (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.sublabel && (
                        <div className="text-[11px] text-slate-400 truncate">
                          {option.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}

            {/* Infinite Scroll Loading Sentinel & Indicator */}
            {hasMore && !searchQuery && (
              <div className="py-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Memuat lebih banyak...</span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onLoadMore}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-xs py-1"
                  >
                    Gulir atau klik untuk memuat lebih
                  </button>
                )}
              </div>
            )}

            {!hasMore && options.length > 0 && !searchQuery && (
              <div className="py-2 text-center text-[11px] text-slate-400 border-t border-slate-100">
                Semua data telah dimuat
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

