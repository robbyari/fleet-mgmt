import React from 'react'
import type { VehicleStatus } from '../../types'
import { getStatusText, getStatusTheme } from '../../utils/formatters'

interface StatusBadgeProps {
  status?: VehicleStatus | null
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const theme = getStatusTheme(status)
  const text = getStatusText(status)

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${theme.bg} ${theme.text} ${theme.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
      <span>{text}</span>
    </span>
  )
}

interface RouteBadgeProps {
  color?: string
  textColor?: string
  shortName?: string
  longName?: string
  id?: string
  className?: string
}

export const RouteBadge: React.FC<RouteBadgeProps> = ({
  color,
  textColor,
  shortName,
  longName,
  id,
  className = '',
}) => {
  const bgStyle = color ? `#${color.replace('#', '')}` : '#0284c7'
  const textStyle = textColor ? `#${textColor.replace('#', '')}` : '#ffffff'
  const displayName = shortName || id || longName || 'Rute'

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-xs font-bold shadow-xs ${className}`}
      style={{ backgroundColor: bgStyle, color: textStyle }}
      title={longName || displayName}
    >
      <span>{displayName}</span>
    </span>
  )
}

