import React, { useMemo } from 'react'
import { Navigation } from 'lucide-react'
import { InfiniteSelect, type SelectOption } from './InfiniteSelect'
import { useInfiniteTrips } from '../../hooks/useInfiniteTrips'

interface TripFilterProps {
  selectedRoutes: string[]
  selectedTrips: string[]
  onChange: (trips: string[]) => void
}

export const TripFilter: React.FC<TripFilterProps> = ({
  selectedRoutes,
  selectedTrips,
  onChange,
}) => {
  const { trips, loading, loadingMore, hasMore, loadMore } = useInfiniteTrips(selectedRoutes)

  const options: SelectOption[] = useMemo(() => {
    return trips.map((t) => ({
      id: t.id,
      label: t.attributes.headsign ? `Menuju ${t.attributes.headsign}` : t.id,
      sublabel: `Arah: ${t.attributes.direction_id === 0 ? 'Outbound (0)' : 'Inbound (1)'} • ID: ${t.id}`,
      badge: t.attributes.name || t.id.slice(0, 8),
    }))
  }, [trips])

  return (
    <InfiniteSelect
      label="Filter Trip"
      icon={<Navigation className="w-4 h-4" />}
      options={options}
      selectedValues={selectedTrips}
      onChange={onChange}
      onLoadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
      loadingMore={loadingMore}
      placeholder="Cari trip (headsign, id)..."
      emptyMessage="Tidak ada trip ditemukan"
    />
  )
}

