import React, { useEffect } from 'react'
import {
  X,
  MapPin,
  Clock,
  Gauge,
  Compass,
  GitBranch,
  Navigation,
  Accessibility,
  Bike,
  Users,
  Copy,
  Check,
} from 'lucide-react'
import type { Route, Stop, Trip, Vehicle } from '../../types'
import { StatusBadge, RouteBadge } from '../common/Badge'
import { VehicleMap } from './VehicleMap'
import {
  formatBearing,
  formatDateTime,
  formatRelativeTime,
  formatSpeed,
} from '../../utils/formatters'

interface VehicleDetailModalProps {
  vehicle: Vehicle | null
  route?: Route
  trip?: Trip
  stop?: Stop
  onClose: () => void
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  route,
  trip,
  stop,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false)

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!vehicle) return null

  const { attributes, relationships } = vehicle
  const displayLabel = attributes.label || vehicle.id

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(`${attributes.latitude}, ${attributes.longitude}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{displayLabel}</h2>
                {relationships?.route?.data?.id && (
                  <RouteBadge
                    color={route?.attributes?.color}
                    textColor={route?.attributes?.text_color}
                    shortName={route?.attributes?.short_name}
                    longName={route?.attributes?.long_name}
                    id={relationships.route.data.id}
                  />
                )}
                <StatusBadge status={attributes.current_status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ID Armada: <span className="font-mono">{vehicle.id}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Interactive Map (Bonus Feature) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                Lokasi Real-Time Pada Peta
              </span>
              <button
                type="button"
                onClick={handleCopyCoordinates}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin' : 'Salin Koordinat'}
              </button>
            </div>
            <VehicleMap
              latitude={attributes.latitude}
              longitude={attributes.longitude}
              label={attributes.label}
              id={vehicle.id}
              status={attributes.current_status}
              className="h-64 rounded-xl border border-slate-200"
            />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3" /> Update Terakhir
              </span>
              <p className="text-xs font-semibold text-slate-800" title={formatDateTime(attributes.updated_at)}>
                {formatRelativeTime(attributes.updated_at)}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                <Gauge className="w-3 h-3" /> Kecepatan
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {formatSpeed(attributes.speed)}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                <Compass className="w-3 h-3" /> Arah / Bearing
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {formatBearing(attributes.bearing)}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                <Users className="w-3 h-3" /> Okupansi
              </span>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {attributes.occupancy_status ? attributes.occupancy_status.replace(/_/g, ' ') : 'N/A'}
              </p>
            </div>
          </div>

          {/* Route & Trip Details in 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Route Details Card */}
            <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-indigo-100 text-indigo-900 font-semibold text-sm">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                <span>Detail Rute</span>
              </div>

              {route ? (
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Rute:</span>
                    <span className="font-semibold text-right">
                      {route.attributes.long_name || route.attributes.short_name || route.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID Rute:</span>
                    <span className="font-mono">{route.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kategori / Tipe:</span>
                    <span>{route.attributes.description || `Type ${route.attributes.type}`}</span>
                  </div>
                  {route.attributes.fare_class && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tarif (Fare Class):</span>
                      <span>{route.attributes.fare_class}</span>
                    </div>
                  )}
                  {route.attributes.direction_destinations?.length > 0 && (
                    <div className="pt-1">
                      <span className="text-slate-500 block mb-0.5">Destinasi:</span>
                      <span className="text-[11px] text-slate-600">
                        {route.attributes.direction_destinations.join(' ↔ ')}
                      </span>
                    </div>
                  )}
                </div>
              ) : relationships?.route?.data?.id ? (
                <div className="text-xs text-slate-600">
                  <p>ID Rute: <strong className="font-mono">{relationships.route.data.id}</strong></p>
                  <p className="text-slate-400 mt-1">Detail rute tambahan tidak disertakan dalam response saat ini.</p>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Tidak ada data rute yang terasosiasi.</div>
              )}
            </div>

            {/* Trip Details Card */}
            <div className="bg-violet-50/40 border border-violet-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-violet-100 text-violet-900 font-semibold text-sm">
                <Navigation className="w-4 h-4 text-violet-600" />
                <span>Detail Trip</span>
              </div>

              {trip ? (
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tujuan (Headsign):</span>
                    <span className="font-semibold text-right">{trip.attributes.headsign || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID Trip:</span>
                    <span className="font-mono truncate max-w-[150px]" title={trip.id}>
                      {trip.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Arah (Direction):</span>
                    <span>{trip.attributes.direction_id === 0 ? 'Outbound (0)' : 'Inbound (1)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Block ID:</span>
                    <span className="font-mono">{trip.attributes.block_id || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-violet-100/70">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Accessibility className="w-3.5 h-3.5 text-slate-500" /> Ramah Kursi Roda:
                    </span>
                    <span className="font-medium">
                      {trip.attributes.wheelchair_accessible === 1 ? 'Ya (Accessible)' : 'Tidak'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5 text-slate-500" /> Akses Sepeda:
                    </span>
                    <span className="font-medium">
                      {trip.attributes.bikes_allowed === 1 ? 'Diizinkan' : 'Tidak diizinkan'}
                    </span>
                  </div>
                </div>
              ) : relationships?.trip?.data?.id ? (
                <div className="text-xs text-slate-600">
                  <p>ID Trip: <strong className="font-mono">{relationships.trip.data.id}</strong></p>
                  <p className="text-slate-400 mt-1">Detail trip tambahan tidak disertakan dalam response saat ini.</p>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Tidak ada data trip yang terasosiasi.</div>
              )}
            </div>
          </div>

          {/* Stop / Sequence & Technical attributes */}
          {(stop || attributes.current_stop_sequence !== undefined) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-slate-400">Urutan Halte Saat Ini: </span>
                <strong className="text-slate-800">#{attributes.current_stop_sequence ?? 0}</strong>
              </div>
              {relationships?.stop?.data?.id && (
                <div>
                  <span className="text-slate-400">ID Halte: </span>
                  <strong className="text-slate-800 font-mono">{relationships.stop.data.id}</strong>
                </div>
              )}
              {attributes.revenue && (
                <div>
                  <span className="text-slate-400">Status Pendapatan: </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                    {attributes.revenue}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Waktu Lengkap: {formatDateTime(attributes.updated_at)}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
