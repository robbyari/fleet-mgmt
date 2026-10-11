import React from 'react'
import { Filter, RotateCcw, Search, X } from 'lucide-react'
import { RouteFilter } from './RouteFilter'
import { TripFilter } from './TripFilter'
import type { VehicleFilters } from '../../types'

interface FilterSectionProps {
  filters: VehicleFilters
  onFiltersChange: (filters: VehicleFilters) => void
  totalResults?: number
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFiltersChange,
  totalResults,
}) => {
  const handleRouteChange = (routes: string[]) => {
    onFiltersChange({ ...filters, routes })
  }

  const handleTripChange = (trips: string[]) => {
    onFiltersChange({ ...filters, trips })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchQuery: e.target.value })
  }

  const handleClearSearch = () => {
    onFiltersChange({ ...filters, searchQuery: '' })
  }

  const handleResetAll = () => {
    onFiltersChange({ routes: [], trips: [], searchQuery: '' })
  }

  const removeRoute = (routeId: string) => {
    onFiltersChange({
      ...filters,
      routes: filters.routes.filter((r) => r !== routeId),
    })
  }

  const removeTrip = (tripId: string) => {
    onFiltersChange({
      ...filters,
      trips: filters.trips.filter((t) => t !== tripId),
    })
  }

  const hasActiveFilters =
    filters.routes.length > 0 ||
    filters.trips.length > 0 ||
    Boolean(filters.searchQuery?.trim())

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search vehicle input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            placeholder="Cari label / ID kendaraan armada..."
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Route Filter Dropdown */}
        <div className="md:col-span-3">
          <RouteFilter
            selectedRoutes={filters.routes}
            onChange={handleRouteChange}
          />
        </div>

        {/* Trip Filter Dropdown */}
        <div className="md:col-span-3">
          <TripFilter
            selectedRoutes={filters.routes}
            selectedTrips={filters.trips}
            onChange={handleTripChange}
          />
        </div>

        {/* Reset Button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={handleResetAll}
            disabled={!hasActiveFilters}
            className={`w-full md:w-auto p-2.5 rounded-xl border flex items-center justify-center transition cursor-pointer text-sm ${
              hasActiveFilters
                ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                : 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
            }`}
            title="Reset semua filter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Filter Badges Bar */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Aktif:</span>
          </div>

          {/* Route Tags */}
          {filters.routes.map((routeId) => (
            <span
              key={routeId}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-medium"
            >
              <span>Rute: {routeId}</span>
              <button
                type="button"
                onClick={() => removeRoute(routeId)}
                className="hover:text-indigo-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Trip Tags */}
          {filters.trips.map((tripId) => (
            <span
              key={tripId}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-lg text-xs font-medium"
            >
              <span>Trip: {tripId.length > 12 ? `${tripId.slice(0, 10)}...` : tripId}</span>
              <button
                type="button"
                onClick={() => removeTrip(tripId)}
                className="hover:text-violet-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Search Tag */}
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium">
              <span>Cari: &ldquo;{filters.searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="hover:text-slate-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {totalResults !== undefined && (
            <span className="text-xs text-slate-400 ml-auto font-medium">
              Ditemukan {totalResults} kendaraan
            </span>
          )}
        </div>
      )}
    </div>
  )
}

