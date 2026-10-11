import React, { useState } from 'react'
import {
  Clock,
  Compass,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Gauge,
} from 'lucide-react'
import type { Route, Trip, Vehicle } from '../../types'
import { StatusBadge, RouteBadge } from '../common/Badge'
import {
  formatCoordinates,
  formatDateTime,
  formatRelativeTime,
  formatSpeed,
} from '../../utils/formatters'

interface VehicleCardProps {
  vehicle: Vehicle
  route?: Route
  trip?: Trip
  onSelect: (vehicle: Vehicle) => void
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  route,
  trip,
  onSelect,
}) => {
  const [copied, setCopied] = useState(false)
  const { attributes, relationships } = vehicle

  const routeId = relationships?.route?.data?.id
  const tripId = relationships?.trip?.data?.id
  const displayLabel = attributes.label || vehicle.id

  const handleCopyCoords = (e: React.MouseEvent) => {
    e.stopPropagation()
    const coords = `${attributes.latitude}, ${attributes.longitude}`
    navigator.clipboard.writeText(coords)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
    >
      {/* Top accent strip using route color if available */}
      {route?.attributes?.color && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: `#${route.attributes.color.replace('#', '')}` }}
        />
      )}

      {/* Card Header: Label & Status */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition truncate">
              {displayLabel}
            </h3>
            {routeId && (
              <RouteBadge
                color={route?.attributes?.color}
                textColor={route?.attributes?.text_color}
                shortName={route?.attributes?.short_name}
                longName={route?.attributes?.long_name}
                id={routeId}
              />
            )}
          </div>
          <StatusBadge status={attributes.current_status} />
        </div>

        {/* Route / Trip Subtitle */}
        <div className="text-xs text-slate-500 mb-4 line-clamp-1">
          {trip?.attributes?.headsign ? (
            <span>Menuju <strong className="text-slate-700">{trip.attributes.headsign}</strong></span>
          ) : route?.attributes?.long_name ? (
            <span>{route.attributes.long_name}</span>
          ) : tripId ? (
            <span>Trip: {tripId}</span>
          ) : (
            <span>Armada Transit Aktif</span>
          )}
        </div>

        {/* Metadata List */}
        <div className="space-y-2 text-xs text-slate-600 bg-slate-50/70 rounded-xl p-3 border border-slate-100">
          {/* Coordinates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Koordinat:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono font-medium text-slate-700">
                {formatCoordinates(attributes.latitude, attributes.longitude)}
              </span>
              <button
                type="button"
                onClick={handleCopyCoords}
                className="p-1 hover:text-indigo-600 text-slate-400 rounded cursor-pointer transition"
                title="Salin koordinat"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Speed & Bearing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Gauge className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Kecepatan:</span>
            </div>
            <span className="font-medium text-slate-700">
              {formatSpeed(attributes.speed)}
            </span>
          </div>

          {attributes.bearing !== null && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Arah (Bearing):</span>
              </div>
              <span className="font-medium text-slate-700">
                {attributes.bearing}°
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Updated At & Detail Action */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <div
          className="flex items-center gap-1.5 text-[11px] text-slate-400"
          title={`Waktu update: ${formatDateTime(attributes.updated_at)}`}
        >
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{formatRelativeTime(attributes.updated_at)}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(vehicle)
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform cursor-pointer"
        >
          <span>Detail</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

