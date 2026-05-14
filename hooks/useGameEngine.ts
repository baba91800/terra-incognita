'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge, Monument, Notification } from '@/types/game'
import {
  REVEAL_RADIUS_METERS,
  MONUMENT_DISCOVER_RADIUS_METERS,
  MOVE_STEP_METERS,
  TILE_POINTS,
  RARITY_POINTS,
} from '@/lib/constants'
import { distanceMeters, tilesInRadius, movePosition } from '@/lib/geo'
import {
  loadTiles, saveTiles,
  loadScore, saveScore,
  loadBadges, saveBadges,
  loadMonuments, saveMonuments,
  loadPlayer, savePlayer,
} from '@/lib/storage'

export function useGameEngine() {
  const [playerLat, setPlayerLat] = useState(48.8566)
  const [playerLng, setPlayerLng] = useState(2.3522)
  const [score, setScore] = useState(0)
  const [badges, setBadges] = useState<Badge[]>([])
  const [monuments, setMonuments] = useState<Monument[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [gpsActive, setGpsActive] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const discoveredTiles = useRef<Set<string>>(new Set())
  const scoreRef = useRef(0)
  const badgesRef = useRef<Badge[]>([])
  const gpsWatchId = useRef<number | null>(null)

  // Notify helper
  const notify = useCallback((n: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random()
    setNotifications(prev => [...prev, { ...n, id }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(x => x.id !== id))
    }, 4000)
  }, [])

  // Badge check
  const checkBadges = useCallback((tiles: Set<string>, score: number, monuments: Monument[]) => {
    const discoveredMonuments = monuments.filter(m => m.discovered)
    const updates: Badge[] = []

    const checks: Array<{ id: string; condition: boolean }> = [
      { id: 'b1', condition: tiles.size >= 1 },
      { id: 'b10', condition: tiles.size >= 50 },
      { id: 'b2', condition: tiles.size >= 100 },
      { id: 'b3', condition: tiles.size >= 500 },
      { id: 'b4', condition: discoveredMonuments.length >= 1 },
      { id: 'b5', condition: discoveredMonuments.length >= 5 },
      { id: 'b6', condition: discoveredMonuments.length >= 10 },
      { id: 'b7', condition: discoveredMonuments.some(m => m.rarity === 'legendary') },
      { id: 'b8', condition: score >= 1000 },
      { id: 'b9', condition: discoveredMonuments.some(m => m.rarity === 'epic') },
    ]

    let changed = false
    const newBadges = badgesRef.current.map(b => {
      const check = checks.find(c => c.id === b.id)
      if (check && check.condition && !b.earned) {
        changed = true
        const updated = { ...b, earned: true, earnedAt: new Date().toISOString() }
        updates.push(updated)
        return updated
      }
      return b
    })

    if (changed) {
      badgesRef.current = newBadges
      setBadges([...newBadges])
      saveBadges(newBadges)
      updates.forEach(b => {
        notify({ type: 'badge', title: b.name, subtitle: b.description, points: 0, icon: b.icon })
      })
    }
  }, [notify])

  // Reveal tiles at a position
  const revealAt = useCallback((lat: number, lng: number, currentMonuments: Monument[]) => {
    const keys = tilesInRadius(lat, lng, REVEAL_RADIUS_METERS)
    const newKeys = keys.filter(k => !discoveredTiles.current.has(k))

    if (newKeys.length > 0) {
      newKeys.forEach(k => discoveredTiles.current.add(k))
      const gained = newKeys.length * TILE_POINTS
      scoreRef.current += gained
      setScore(scoreRef.current)
      saveTiles(discoveredTiles.current)
      saveScore(scoreRef.current)
    }

    // Check monuments
    const updatedMonuments = currentMonuments.map(m => {
      if (m.discovered) return m
      const dist = distanceMeters(lat, lng, m.lat, m.lng)
      if (dist <= MONUMENT_DISCOVER_RADIUS_METERS) {
        const pts = RARITY_POINTS[m.rarity]
        scoreRef.current += pts
        setScore(scoreRef.current)
        saveScore(scoreRef.current)
        notify({
          type: 'monument',
          title: m.name,
          subtitle: m.type,
          points: pts,
          rarity: m.rarity,
        })
        return { ...m, discovered: true, discoveredAt: new Date().toISOString() }
      }
      return m
    })

    const monumentsChanged = updatedMonuments.some((m, i) => m.discovered !== currentMonuments[i].discovered)
    if (monumentsChanged) {
      setMonuments([...updatedMonuments])
      saveMonuments(updatedMonuments)
      checkBadges(discoveredTiles.current, scoreRef.current, updatedMonuments)
      return updatedMonuments
    }

    checkBadges(discoveredTiles.current, scoreRef.current, currentMonuments)
    return currentMonuments
  }, [notify, checkBadges])

  // Init from localStorage
  useEffect(() => {
    const tiles = loadTiles()
    const savedScore = loadScore()
    const savedBadges = loadBadges()
    const savedMonuments = loadMonuments()
    const savedPlayer = loadPlayer()

    discoveredTiles.current = tiles
    scoreRef.current = savedScore
    badgesRef.current = savedBadges

    setScore(savedScore)
    setBadges(savedBadges)
    setMonuments(savedMonuments)
    setPlayerLat(savedPlayer.lat)
    setPlayerLng(savedPlayer.lng)
    setInitialized(true)
  }, [])

  // Move player (simulation)
  const move = useCallback((direction: 'north' | 'south' | 'east' | 'west') => {
    setPlayerLat(prevLat => {
      setPlayerLng(prevLng => {
        const { lat: newLat, lng: newLng } = movePosition(prevLat, prevLng, direction, MOVE_STEP_METERS)
        savePlayer(newLat, newLng)
        setMonuments(prevMonuments => {
          return revealAt(newLat, newLng, prevMonuments)
        })
        setTimeout(() => {
          setPlayerLat(newLat)
          setPlayerLng(newLng)
        }, 0)
        return newLng
      })
      return prevLat
    })
  }, [revealAt])

  // Better move function using refs
  const playerLatRef = useRef(48.8566)
  const playerLngRef = useRef(2.3522)
  const monumentsRef = useRef<Monument[]>([])

  useEffect(() => { playerLatRef.current = playerLat }, [playerLat])
  useEffect(() => { playerLngRef.current = playerLng }, [playerLng])
  useEffect(() => { monumentsRef.current = monuments }, [monuments])

  const moveDirect = useCallback((direction: 'north' | 'south' | 'east' | 'west') => {
    const { lat: newLat, lng: newLng } = movePosition(
      playerLatRef.current,
      playerLngRef.current,
      direction,
      MOVE_STEP_METERS
    )
    playerLatRef.current = newLat
    playerLngRef.current = newLng
    setPlayerLat(newLat)
    setPlayerLng(newLng)
    savePlayer(newLat, newLng)
    const updated = revealAt(newLat, newLng, monumentsRef.current)
    monumentsRef.current = updated
  }, [revealAt])

  // GPS mode
  const startGPS = useCallback(() => {
    if (!navigator.geolocation) return
    setGpsActive(true)
    gpsWatchId.current = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        playerLatRef.current = latitude
        playerLngRef.current = longitude
        setPlayerLat(latitude)
        setPlayerLng(longitude)
        savePlayer(latitude, longitude)
        const updated = revealAt(latitude, longitude, monumentsRef.current)
        monumentsRef.current = updated
      },
      err => { console.warn('GPS error:', err); setGpsActive(false) },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    )
  }, [revealAt])

  const stopGPS = useCallback(() => {
    if (gpsWatchId.current !== null) {
      navigator.geolocation.clearWatch(gpsWatchId.current)
      gpsWatchId.current = null
    }
    setGpsActive(false)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
      switch (e.key) {
        case 'ArrowUp': moveDirect('north'); break
        case 'ArrowDown': moveDirect('south'); break
        case 'ArrowLeft': moveDirect('west'); break
        case 'ArrowRight': moveDirect('east'); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [moveDirect])

  // Initial reveal at starting position
  useEffect(() => {
    if (initialized && monuments.length > 0) {
      revealAt(playerLatRef.current, playerLngRef.current, monumentsRef.current)
    }
  }, [initialized]) // eslint-disable-line

  const totalTiles = discoveredTiles.current.size
  const explorationPercent = Math.min(100, (totalTiles / 10000) * 100).toFixed(1)

  return {
    playerLat,
    playerLng,
    score,
    badges,
    monuments,
    notifications,
    gpsActive,
    initialized,
    discoveredTiles: discoveredTiles.current,
    totalTiles,
    explorationPercent,
    moveDirect,
    startGPS,
    stopGPS,
  }
}
