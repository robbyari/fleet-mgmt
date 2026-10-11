import React from 'react'
import type { Route, Trip, Vehicle } from '../../types'
import { VehicleCard } from './VehicleCard'

interface VehicleGridProps {
  vehicles: Vehicle[]
  getRouteForVehicle: (vehicle: Vehicle) => Route | undefined
  getTripForVehicle: (vehicle: Vehicle) => Trip | undefined
  onSelectVehicle: (vehicle: Vehicle) => void
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  getRouteForVehicle,
  getTripForVehicle,
  onSelectVehicle,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          route={getRouteForVehicle(vehicle)}
          trip={getTripForVehicle(vehicle)}
          onSelect={onSelectVehicle}
        />
      ))}
    </div>
  )
}

