import type { VehicleStatus } from '../types'

/**
 * Format ISO datetime string to Indonesian localized readable string
 */
export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return '-'
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return isoString
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(date)
  } catch {
    return isoString
  }
}

/**
 * Format ISO datetime to relative time (e.g. "5 detik lalu", "2 menit lalu")
 */
export function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return '-'
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return '-'
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSec < 10) return 'Baru saja'
    if (diffSec < 60) return `${diffSec} detik lalu`
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} menit lalu`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours} jam lalu`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} hari lalu`
  } catch {
    return '-'
  }
}

/**
 * Get friendly human-readable translation for vehicle status
 */
export function getStatusText(status?: VehicleStatus | null): string {
  switch (status) {
    case 'STOPPED_AT':
      return 'Berhenti di Halte'
    case 'IN_TRANSIT_TO':
      return 'Dalam Perjalanan Menuju'
    case 'INCOMING_AT':
      return 'Mendekati Halte'
    default:
      return status ? status.replace(/_/g, ' ') : 'Tidak Diketahui'
  }
}

/**
 * Get status color classes for badges
 */
export function getStatusTheme(status?: VehicleStatus | null): {
  bg: string
  text: string
  border: string
  dot: string
} {
  switch (status) {
    case 'IN_TRANSIT_TO':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500 animate-pulse',
      }
    case 'STOPPED_AT':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
      }
    case 'INCOMING_AT':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-500 animate-ping',
      }
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-900/40',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-800',
        dot: 'bg-slate-400',
      }
  }
}

/**
 * Format coordinates to neat decimal string
 */
export function formatCoordinates(lat?: number | null, lng?: number | null): string {
  if (lat == null || lng == null) return 'N/A'
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

/**
 * Format speed to km/h or m/s
 */
export function formatSpeed(speed?: number | null): string {
  if (speed == null) return '0 km/h'
  // speed in MBTA API is usually meters/sec or mph, let's format nicely
  const kmh = Math.round(speed * 3.6)
  return `${kmh} km/h`
}

/**
 * Format bearing to compass direction
 */
export function formatBearing(bearing?: number | null): string {
  if (bearing == null) return '-'
  const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL']
  const index = Math.round(((bearing %= 360) < 0 ? bearing + 360 : bearing) / 45) % 8
  return `${bearing}° (${directions[index]})`
}

