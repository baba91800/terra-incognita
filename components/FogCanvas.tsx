'use client'

import { useEffect, useRef, useCallback } from 'react'
import { latLngToTile, tileKey } from '@/lib/geo'
import { TILE_SIZE_METERS } from '@/lib/constants'

interface FogCanvasProps {
  mapRef: React.RefObject<L.Map | null>
  discoveredTiles: Set<string>
  playerLat: number
  playerLng: number
}

const METERS_PER_LAT = 111320

export default function FogCanvas({ mapRef, discoveredTiles, playerLat, playerLng }: FogCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)

  const draw = useCallback(() => {
    const map = mapRef.current
    const canvas = canvasRef.current
    if (!map || !canvas) return

    const size = map.getSize()
    canvas.width = size.x
    canvas.height = size.y

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Fill fog
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // For each discovered tile, punch a hole in the fog
    ctx.globalCompositeOperation = 'destination-out'

    const bounds = map.getBounds()
    const zoom = map.getZoom()

    discoveredTiles.forEach(key => {
      const [txStr, tyStr] = key.split(':')
      const tx = parseInt(txStr, 10)
      const ty = parseInt(tyStr, 10)

      // Convert tile to lat/lng
      const METERS_PER_LNG_AT_LAT = METERS_PER_LAT * Math.cos((playerLat * Math.PI) / 180)
      const tileLat = (ty + 0.5) * TILE_SIZE_METERS / METERS_PER_LAT
      const tileLng = (tx + 0.5) * TILE_SIZE_METERS / METERS_PER_LNG_AT_LAT

      // Quick bounds check
      if (
        tileLat < bounds.getSouth() - 0.005 ||
        tileLat > bounds.getNorth() + 0.005 ||
        tileLng < bounds.getWest() - 0.005 ||
        tileLng > bounds.getEast() + 0.005
      ) return

      try {
        const point = map.latLngToContainerPoint([tileLat, tileLng])

        // Calculate pixel size of tile at current zoom
        const metersPerPixel = (156543.03392 * Math.cos((tileLat * Math.PI) / 180)) / Math.pow(2, zoom)
        const tilePixels = TILE_SIZE_METERS / metersPerPixel

        // Draw revealed circle with soft edges
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, tilePixels * 1.2
        )
        gradient.addColorStop(0, 'rgba(0,0,0,1)')
        gradient.addColorStop(0.7, 'rgba(0,0,0,0.9)')
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(point.x, point.y, tilePixels * 1.2, 0, Math.PI * 2)
        ctx.fill()
      } catch {}
    })

    ctx.globalCompositeOperation = 'source-over'

    // Add subtle edge vignette on revealed areas
    const vigGrad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
      canvas.width / 2, canvas.height / 2, canvas.height * 0.8
    )
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)')
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.3)')
    ctx.fillStyle = vigGrad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

  }, [discoveredTiles, playerLat, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const onMove = () => {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = requestAnimationFrame(draw)
    }

    map.on('move zoom moveend zoomend', onMove)
    draw()

    return () => {
      map.off('move zoom moveend zoomend', onMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [mapRef, draw])

  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = requestAnimationFrame(draw)
  }, [discoveredTiles.size, draw])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 500 }}
    />
  )
}
