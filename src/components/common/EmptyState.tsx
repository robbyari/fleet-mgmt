import React from 'react'
import { Bus, FilterX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  onResetFilters?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak Ada Kendaraan Ditemukan',
  description = 'Tidak ada armada yang sesuai dengan kriteria filter rute atau trip yang dipilih.',
  onResetFilters,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md mx-auto text-center shadow-xs">
      <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
        <Bus className="w-8 h-8 stroke-1" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>

      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition cursor-pointer border border-indigo-200"
        >
          <FilterX className="w-4 h-4" />
          Reset Semua Filter
        </button>
      )}
    </div>
  )
}

