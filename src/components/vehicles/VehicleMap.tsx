import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface VehicleMapProps {
  latitude: number
  longitude: number
  label?: string | null
  id: string
  status?: string | null
  className?: string
}

export const VehicleMap: React.FC<VehicleMapProps> = ({
  latitude,
  longitude,
  label,
  id,
  status,
  className = 'h-64 w-full rounded-xl',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Create custom SVG vehicle icon to avoid missing PNG asset issues
    const vehicleIcon = L.divIcon({
      className: 'custom-vehicle-marker',
      html: `
        <div style="
          background-color: #4f46e5;
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    })

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([latitude, longitude], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const marker = L.marker([latitude, longitude], { icon: vehicleIcon }).addTo(map)
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
          <strong>Armada: ${label || id}</strong><br/>
          <span style="color: #64748b;">Status: ${status || '-'}</span><br/>
          <span style="font-size: 11px; color: #94a3b8;">${latitude.toFixed(5)}, ${longitude.toFixed(5)}</span>
        </div>
      `).openPopup()

      mapInstanceRef.current = map
      markerRef.current = marker
    } else {
      // Update existing map view and marker
      mapInstanceRef.current.setView([latitude, longitude], 15)
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude])
      }
    }

    // Invalidate size after rendering to ensure proper tile layout
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize()
    }, 200)

    return () => {
      clearTimeout(timer)
    }
  }, [latitude, longitude, label, id, status])

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className={`relative overflow-hidden border border-slate-200 z-10 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  )
}

