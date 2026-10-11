import { useState } from 'react'
import type { Vehicle } from './types'
import { useVehicles } from './hooks/useVehicles'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { FilterSection } from './components/filters/FilterSection'
import { VehicleGrid } from './components/vehicles/VehicleGrid'
import { VehicleDetailModal } from './components/vehicles/VehicleDetailModal'
import { PaginationBar } from './components/pagination/PaginationBar'
import { SkeletonGrid } from './components/common/LoadingSkeleton'
import { ErrorState } from './components/common/ErrorState'
import { EmptyState } from './components/common/EmptyState'

export function App() {
  const {
    vehicles,
    loading,
    error,
    pagination,
    filters,
    setPage,
    setLimit,
    setFilters,
    refetch,
    getRouteForVehicle,
    getTripForVehicle,
    getStopForVehicle,
  } = useVehicles(9)

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Filter Bar with Infinite Scroll Dropdowns */}
        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={pagination.totalItems}
        />

        {/* Content Area */}
        <section aria-label="Daftar Armada" className="min-h-[400px]">
          {loading && vehicles.length === 0 ? (
            <SkeletonGrid count={pagination.limit} />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={refetch}
            />
          ) : vehicles.length === 0 ? (
            <EmptyState
              onResetFilters={() => setFilters({ routes: [], trips: [], searchQuery: '' })}
            />
          ) : (
            <div className="space-y-6">
              {/* Overlay loading indicator when refetching or paginating */}
              <div className="relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-10 flex items-center justify-center rounded-2xl transition">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 text-xs font-semibold text-indigo-600 flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      Memperbarui data...
                    </div>
                  </div>
                )}

                <VehicleGrid
                  vehicles={vehicles}
                  getRouteForVehicle={getRouteForVehicle}
                  getTripForVehicle={getTripForVehicle}
                  onSelectVehicle={setSelectedVehicle}
                />
              </div>

              {/* Pagination Controls */}
              <PaginationBar
                pagination={pagination}
                onPageChange={setPage}
                onLimitChange={setLimit}
                limitOptions={[6, 9, 12, 18, 24]}
              />
            </div>
          )}
        </section>
      </main>

      {/* Vehicle Detail Popup Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        route={selectedVehicle ? getRouteForVehicle(selectedVehicle) : undefined}
        trip={selectedVehicle ? getTripForVehicle(selectedVehicle) : undefined}
        stop={selectedVehicle ? getStopForVehicle(selectedVehicle) : undefined}
        onClose={() => setSelectedVehicle(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
