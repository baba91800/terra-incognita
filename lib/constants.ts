export const TILE_SIZE_METERS = 10
export const REVEAL_RADIUS_METERS = 30
export const MONUMENT_DISCOVER_RADIUS_METERS = 25
export const MOVE_STEP_METERS = 10

export const RARITY_POINTS = {
  common: 50,
  rare: 150,
  epic: 300,
  legendary: 1000,
} as const

export const RARITY_COLORS = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
} as const

export const RARITY_LABELS = {
  common: 'COMMON',
  rare: 'RARE',
  epic: 'EPIC',
  legendary: 'LEGENDARY',
} as const

export const TILE_POINTS = 10

// Paris centered monuments
export const DEFAULT_MONUMENTS = [
  { id: 'm1', name: 'Tour Eiffel', lat: 48.8584, lng: 2.2945, rarity: 'legendary' as const, type: 'monument', discovered: false },
  { id: 'm2', name: 'Arc de Triomphe', lat: 48.8738, lng: 2.295, rarity: 'epic' as const, type: 'monument', discovered: false },
  { id: 'm3', name: 'Musée du Louvre', lat: 48.8606, lng: 2.3376, rarity: 'legendary' as const, type: 'museum', discovered: false },
  { id: 'm4', name: 'Cathédrale Notre-Dame', lat: 48.853, lng: 2.3499, rarity: 'epic' as const, type: 'cathedral', discovered: false },
  { id: 'm5', name: 'Sacré-Cœur', lat: 48.8867, lng: 2.3431, rarity: 'epic' as const, type: 'cathedral', discovered: false },
  { id: 'm6', name: 'Musée d\'Orsay', lat: 48.8599, lng: 2.3266, rarity: 'rare' as const, type: 'museum', discovered: false },
  { id: 'm7', name: 'Palais Royal', lat: 48.8638, lng: 2.337, rarity: 'rare' as const, type: 'monument', discovered: false },
  { id: 'm8', name: 'Place de la Bastille', lat: 48.8533, lng: 2.3692, rarity: 'common' as const, type: 'monument', discovered: false },
  { id: 'm9', name: 'Panthéon', lat: 48.8462, lng: 2.3461, rarity: 'rare' as const, type: 'monument', discovered: false },
  { id: 'm10', name: 'Sainte-Chapelle', lat: 48.8554, lng: 2.345, rarity: 'rare' as const, type: 'cathedral', discovered: false },
  { id: 'm11', name: 'Place des Vosges', lat: 48.8554, lng: 2.3646, rarity: 'common' as const, type: 'monument', discovered: false },
  { id: 'm12', name: 'Opéra Garnier', lat: 48.8719, lng: 2.3316, rarity: 'rare' as const, type: 'monument', discovered: false },
]

export const DEFAULT_BADGES = [
  { id: 'b1', name: 'First Steps', description: 'Discover 10 tiles', icon: '👣', earned: false },
  { id: 'b2', name: 'Explorer', description: 'Discover 500 tiles', icon: '🗺️', earned: false },
  { id: 'b3', name: 'Urban Explorer', description: 'Discover 2000 tiles', icon: '🏙️', earned: false },
  { id: 'b4', name: 'Monument Hunter', description: 'Discover your first monument', icon: '🏛️', earned: false },
  { id: 'b5', name: 'Castle Seeker', description: 'Discover 5 monuments', icon: '🏰', earned: false },
  { id: 'b6', name: 'Capital Explorer', description: 'Discover 10 monuments', icon: '🌆', earned: false },
  { id: 'b7', name: 'Legendary Discoverer', description: 'Discover a Legendary monument', icon: '⭐', earned: false },
  { id: 'b8', name: 'Century', description: 'Reach 5000 points', icon: '💯', earned: false },
  { id: 'b9', name: 'Epic Hunter', description: 'Discover an Epic monument', icon: '💎', earned: false },
  { id: 'b10', name: 'Night Wanderer', description: 'Discover 200 tiles', icon: '🌙', earned: false },
]

export const DEFAULT_LAT = 48.8566
export const DEFAULT_LNG = 2.3522
