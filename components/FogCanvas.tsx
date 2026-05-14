'use client'

import { useEffect, useRef, useCallback } from 'react'
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

    // Brouillard NOIR TOTAL (Opacité à 1.0 pour une obscurité parfaite)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Mode "Découpe" pour percer le brouillard
    ctx.globalCompositeOperation = 'destination-out'

    const bounds = map.getBounds()
    const zoom = map.getZoom()

    discoveredTiles.forEach(key => {
      const [txStr, tyStr] = key.split(':')
      const tx = parseInt(txStr, 10)
      const ty = parseInt(tyStr, 10)

      const METERS_PER_LNG_AT_LAT = METERS_PER_LAT * Math.cos((playerLat * Math.PI) / 180)
      const tileLat = (ty + 0.5) * TILE_SIZE_METERS / METERS_PER_LAT
      const tileLng = (tx + 0.5) * TILE_SIZE_METERS / METERS_PER_LNG_AT_LAT

      // Optimisation : on ne dessine que ce qui est visible à l'écran
      if (
        tileLat < bounds.getSouth() - 0.01 ||
        tileLat > bounds.getNorth() + 0.01 ||
        tileLng < bounds.getWest() - 0.01 ||
        tileLng > bounds.getEast() + 0.01
      ) return

      try {
        const point = map.latLngToContainerPoint([tileLat, tileLng])
        const metersPerPixel = (156543.03392 * Math.cos((tileLat * Math.PI) / 180)) / Math.pow(2, zoom)
        const tilePixels = TILE_SIZE_METERS / metersPerPixel

        // Création d'un trou net (transition ultra-rapide à 98%)
        const gradient = ctx.createRadialGradient(
          point.x, point
