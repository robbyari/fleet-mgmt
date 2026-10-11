import { useCallback, useEffect, useRef, useState } from 'react'
import type { Route } from '../types'
import { getRoutes } from '../services/routeService'

const PAGE_SIZE = 20

export function useInfiniteRoutes() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [offset, setOffset] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const isFetchingRef = useRef(false)

  // Initial fetch
  useEffect(() => {
    let isMounted = true
    const fetchInitial = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getRoutes({ offset: 0, limit: PAGE_SIZE })
        if (!isMounted) return
        setRoutes(response.data || [])
        setOffset(PAGE_SIZE)
        setHasMore(Boolean(response.links?.next && response.data?.length === PAGE_SIZE))
      } catch (err: unknown) {
        if (!isMounted) return
        setError((err as Error).message || 'Gagal memuat rute')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchInitial()

    return () => {
      isMounted = false
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || loading || loadingMore) return

    isFetchingRef.current = true
    setLoadingMore(true)

    try {
      const response = await getRoutes({ offset, limit: PAGE_SIZE })
      const newItems = response.data || []

      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setRoutes((prev) => {
          // Deduplicate by ID
          const existingIds = new Set(prev.map((r) => r.id))
          const filtered = newItems.filter((r) => !existingIds.has(r.id))
          return [...prev, ...filtered]
        })
        setOffset((prev) => prev + PAGE_SIZE)
        setHasMore(Boolean(response.links?.next && newItems.length === PAGE_SIZE))
      }
    } catch (err: unknown) {
      console.warn('Gagal load more routes:', err)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
      isFetchingRef.current = false
    }
  }, [hasMore, loading, loadingMore, offset])

  return {
    routes,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
  }
}

