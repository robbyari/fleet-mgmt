import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type { PaginationState } from '../../types'
import { getPaginationRange } from '../../utils/pagination'

interface PaginationBarProps {
  pagination: PaginationState
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  limitOptions?: number[]
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  limitOptions = [6, 9, 12, 18, 24],
}) => {
  const { page, limit, totalItems, totalPages, fromItem, toItem } = pagination

  const pageRange = getPaginationRange(page, totalPages)

  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      {/* Left section: Data range & Limit selector */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600">
        {/* Rentang Data yang sedang ditampilkan */}
        <div className="font-medium">
          Menampilkan{' '}
          <span className="font-bold text-slate-900">
            {totalItems > 0 ? `${fromItem}-${toItem}` : '0'}
          </span>{' '}
          dari <span className="font-bold text-slate-900">{totalItems}</span> Data
        </div>

        {/* Separator */}
        <span className="text-slate-300 hidden sm:inline">|</span>

        {/* Pilihan untuk mengubah jumlah data per halaman */}
        <div className="flex items-center gap-2">
          <label htmlFor="limit-select" className="text-slate-500 whitespace-nowrap">
            Tampilkan per halaman:
          </label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right section: Page navigation & Total pages */}
      <div className="flex items-center gap-2">
        {/* Jumlah halaman yang tersedia */}
        <div className="text-xs text-slate-500 mr-2 hidden sm:block">
          Halaman <strong className="text-slate-800">{page}</strong> dari{' '}
          <strong className="text-slate-800">{totalPages}</strong>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          {/* First page button */}
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={isFirstPage}
            className={`p-1.5 rounded-lg border transition ${
              isFirstPage
                ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer'
            }`}
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page button */}
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={isFirstPage}
            className={`p-1.5 rounded-lg border transition ${
              isFirstPage
                ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer'
            }`}
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageRange.map((p, idx) => {
              if (p === 'ellipsis-start' || p === 'ellipsis-end') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-slate-400 font-bold"
                  >
                    ...
                  </span>
                )
              }

              const isCurrent = p === page

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p as number)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>

          {/* Next page button */}
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={isLastPage}
            className={`p-1.5 rounded-lg border transition ${
              isLastPage
                ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer'
            }`}
            title="Halaman Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page button */}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={isLastPage}
            className={`p-1.5 rounded-lg border transition ${
              isLastPage
                ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer'
            }`}
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

