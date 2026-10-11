import { useCallback, useEffect, useRef, useState } from 'react'
import type { Trip } from '../types'
import { getTrips } from '../services/tripService'

const PAGE_SIZE = 20

export function useInfiniteTrips(selectedRoutes: string[] = []) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [offset, setOffset] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const isFetchingRef = useRef(false)
  const routesKey = selectedRoutes.slice().sort().join(',')

  // Fetch initial when selectedRoutes change
  useEffect(() => {
    let isMounted = true

    const fetchInitial = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getTrips({
          offset: 0,
          limit: PAGE_SIZE,
          routes: selectedRoutes,
        })
        if (!isMounted) return
        setTrips(response.data || [])
        setOffset(PAGE_SIZE)
        setHasMore(Boolean(response.links?.next && response.data?.length === PAGE_SIZE))
      } catch (err: unknown) {
        if (!isMounted) return
        setError((err as Error).message || 'Gagal memuat trip')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchInitial()

    return () => {
      isMounted = false
    }
  }, [routesKey, selectedRoutes])

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || loading || loadingMore) return

    isFetchingRef.current = true
    setLoadingMore(true)

    try {
      const response = await getTrips({
        offset,
        limit: PAGE_SIZE,
        routes: selectedRoutes,
      })
      const newItems = response.data || []

      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setTrips((prev) => {
          const existingIds = new Set(prev.map((t) => t.id))
          const filtered = newItems.filter((t) => !existingIds.has(t.id))
          return [...prev, ...filtered]
        })
        setOffset((prev) => prev + PAGE_SIZE)
        setHasMore(Boolean(response.links?.next && newItems.length === PAGE_SIZE))
      }
    } catch (err: unknown) {
      console.warn('Gagal load more trips:', err)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
      isFetchingRef.current = false
    }
  }, [hasMore, loading, loadingMore, offset, selectedRoutes])

  return {
    trips,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
  }
}
