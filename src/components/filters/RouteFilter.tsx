import React, { useMemo } from 'react'
import { GitBranch } from 'lucide-react'
import { InfiniteSelect, type SelectOption } from './InfiniteSelect'
import { useInfiniteRoutes } from '../../hooks/useInfiniteRoutes'

interface RouteFilterProps {
  selectedRoutes: string[]
  onChange: (routes: string[]) => void
}

export const RouteFilter: React.FC<RouteFilterProps> = ({
  selectedRoutes,
  onChange,
}) => {
  const { routes, loading, loadingMore, hasMore, loadMore } = useInfiniteRoutes()

  const options: SelectOption[] = useMemo(() => {
    return routes.map((r) => ({
      id: r.id,
      label: r.attributes.long_name || r.attributes.short_name || r.id,
      sublabel: r.attributes.description || r.attributes.fare_class || `Tipe ${r.attributes.type}`,
      color: r.attributes.color,
      textColor: r.attributes.text_color,
      badge: r.attributes.short_name || r.id,
    }))
  }, [routes])

  return (
    <InfiniteSelect
      label="Filter Rute"
      icon={<GitBranch className="w-4 h-4" />}
      options={options}
      selectedValues={selectedRoutes}
      onChange={onChange}
      onLoadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
      loadingMore={loadingMore}
      placeholder="Cari rute (nama, id)..."
      emptyMessage="Tidak ada rute ditemukan"
    />
  )
}

