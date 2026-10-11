import React from 'react'

export const VehicleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs animate-pulse flex flex-col justify-between h-[230px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-24 bg-slate-200 rounded-md" />
          <div className="h-6 w-28 bg-slate-200 rounded-full" />
        </div>
        <div className="space-y-2.5">
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-1/2 bg-slate-200 rounded" />
          <div className="h-4 w-2/3 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-20 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
      </div>
    </div>
  )
}

interface SkeletonGridProps {
  count?: number
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 9 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  )
}

