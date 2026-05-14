import { Badge, Monument } from '@/types/game'
import { DEFAULT_BADGES, DEFAULT_MONUMENTS, DEFAULT_LAT, DEFAULT_LNG } from './constants'

const KEYS = {
  TILES: 'ti_tiles',
  SCORE: 'ti_score',
  BADGES: 'ti_badges',
  MONUMENTS: 'ti_monuments',
  PLAYER: 'ti_player',
}

export function saveTiles(tiles: Set<string>): void {
  try {
    localStorage.setItem(KEYS.TILES, JSON.stringify([...tiles]))
  } catch {}
}

export function loadTiles(): Set<string> {
  try {
    const raw = localStorage.getItem(KEYS.TILES)
    if (raw) return new Set(JSON.parse(raw))
  } catch {}
  return new Set()
}

export function saveScore(score: number): void {
  try {
    localStorage.setItem(KEYS.SCORE, String(score))
  } catch {}
}

export function loadScore(): number {
  try {
    const raw = localStorage.getItem(KEYS.SCORE)
    if (raw) return parseInt(raw, 10)
  } catch {}
  return 0
}

export function saveBadges(badges: Badge[]): void {
  try {
    localStorage.setItem(KEYS.BADGES, JSON.stringify(badges))
  } catch {}
}

export function loadBadges(): Badge[] {
  try {
    const raw = localStorage.getItem(KEYS.BADGES)
    if (raw) {
      const saved = JSON.parse(raw) as Badge[]
      // Merge with defaults to catch new badges
      return DEFAULT_BADGES.map(def => {
        const found = saved.find(b => b.id === def.id)
        return found || def
      })
    }
  } catch {}
  return [...DEFAULT_BADGES]
}

export function saveMonuments(monuments: Monument[]): void {
  try {
    localStorage.setItem(KEYS.MONUMENTS, JSON.stringify(monuments))
  } catch {}
}

export function loadMonuments(): Monument[] {
  try {
    const raw = localStorage.getItem(KEYS.MONUMENTS)
    if (raw) {
      const saved = JSON.parse(raw) as Monument[]
      return DEFAULT_MONUMENTS.map(def => {
        const found = saved.find(m => m.id === def.id)
        return found ? { ...def, discovered: found.discovered, discoveredAt: found.discoveredAt } : def
      })
    }
  } catch {}
  return [...DEFAULT_MONUMENTS]
}

export function savePlayer(lat: number, lng: number): void {
  try {
    localStorage.setItem(KEYS.PLAYER, JSON.stringify({ lat, lng }))
  } catch {}
}

export function loadPlayer(): { lat: number; lng: number } {
  try {
    const raw = localStorage.getItem(KEYS.PLAYER)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { lat: DEFAULT_LAT, lng: DEFAULT_LNG }
}

export function clearAll(): void {
  Object.values(KEYS).forEach(k => {
    try { localStorage.removeItem(k) } catch {}
  })
}
