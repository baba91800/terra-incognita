export type TileKey = string // "x:y"
export type TileState = 'hidden' | 'discovered'

export interface Monument {
  id: string
  name: string
  lat: number
  lng: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  type: string
  discovered: boolean
  discoveredAt?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
  location?: string
}

export interface GameState {
  discoveredTiles: Set<TileKey>
  score: number
  badges: Badge[]
  monuments: Monument[]
  playerLat: number
  playerLng: number
}

export interface Notification {
  id: string
  type: 'monument' | 'badge' | 'tile'
  title: string
  subtitle?: string
  points: number
  rarity?: Monument['rarity']
  icon?: string
}
