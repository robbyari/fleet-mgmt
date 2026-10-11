import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  IncludedResource,
  PaginationState,
  Route,
  Stop,
  Trip,
  Vehicle,
  VehicleFilters,
} from '../types'
import { getVehicles } from '../services/vehicleService'
import { calculatePaginationMeta } from '../utils/pagination'

interface UseVehiclesReturn {
  vehicles: Vehicle[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  filters: VehicleFilters
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setFilters: (newFilters: VehicleFilters) => void
  refetch: () => void
  getRouteForVehicle: (vehicle: Vehicle) => Route | undefined
  getTripForVehicle: (vehicle: Vehicle) => Trip | undefined
  getStopForVehicle: (vehicle: Vehicle) => Stop | undefined
}

export function useVehicles(initialLimit = 9): UseVehiclesReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [included, setIncluded] = useState<IncludedResource[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(initialLimit)
  const [filters, setFilters] = useState<VehicleFilters>({ routes: [], trips: [] })

  const [paginationMeta, setPaginationMeta] = useState<{
    totalItems: number
    totalPages: number
    fromItem: number
    toItem: number
    offset: number
  }>({
    totalItems: 0,
    totalPages: 1,
    fromItem: 0,
    toItem: 0,
    offset: 0,
  })

  const [reloadTrigger, setReloadTrigger] = useState<number>(0)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getVehicles(
          {
            page,
            limit,
            routes: filters.routes,
            trips: filters.trips,
            sort: '-updated_at',
          },
          { signal: controller.signal }
        )

        if (!isMounted) return

        let items = response.data || []

        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.toLowerCase().trim()
          items = items.filter(
            (v) =>
              (v.attributes.label && v.attributes.label.toLowerCase().includes(q)) ||
              v.id.toLowerCase().includes(q) ||
              (v.relationships?.route?.data?.id &&
                v.relationships.route.data.id.toLowerCase().includes(q))
          )
        }

        setVehicles(items)
        setIncluded(response.included || [])

        const calculated = calculatePaginationMeta(
          page,
          limit,
          items.length,
          response.links
        )
        setPaginationMeta(calculated)
      } catch (err: unknown) {
        if (!isMounted || (err as Error).name === 'AbortError') {
          return
        }
        const msg = (err as Error).message || 'Terjadi kesalahan saat mengambil data armada'
        setError(msg)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [page, limit, filters, reloadTrigger])

  const refetch = useCallback(() => {
    setReloadTrigger((prev) => prev + 1)
  }, [])

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }, [])

  const handleSetFilters = useCallback((newFilters: VehicleFilters) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  // Map of included resources by `type:id` for fast O(1) lookup
  const includedMap = useMemo(() => {
    const map = new Map<string, IncludedResource>()
    included.forEach((item) => {
      map.set(`${item.type}:${item.id}`, item)
    })
    return map
  }, [included])

  const getRouteForVehicle = useCallback(
    (vehicle: Vehicle): Route | undefined => {
      const routeId = vehicle.relationships?.route?.data?.id
      if (!routeId) return undefined
      return includedMap.get(`route:${routeId}`) as Route | undefined
    },
    [includedMap]
  )

  const getTripForVehicle = useCallback(
    (vehicle: Vehicle): Trip | undefined => {
      const tripId = vehicle.relationships?.trip?.data?.id
      if (!tripId) return undefined
      return includedMap.get(`trip:${tripId}`) as Trip | undefined
    },
    [includedMap]
  )

  const getStopForVehicle = useCallback(
    (vehicle: Vehicle): Stop | undefined => {
      const stopId = vehicle.relationships?.stop?.data?.id
      if (!stopId) return undefined
      return includedMap.get(`stop:${stopId}`) as Stop | undefined
    },
    [includedMap]
  )

  const paginationState: PaginationState = useMemo(
    () => ({
      page,
      limit,
      ...paginationMeta,
    }),
    [page, limit, paginationMeta]
  )

  return {
    vehicles,
    loading,
    error,
    pagination: paginationState,
    filters,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setFilters: handleSetFilters,
    refetch,
    getRouteForVehicle,
    getTripForVehicle,
    getStopForVehicle,
  }
}
