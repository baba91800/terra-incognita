'use client'

import { useState } from 'react'
import { Badge, Monument } from '@/types/game'
import { RARITY_COLORS, RARITY_LABELS } from '@/lib/constants'

interface HUDProps {
  score: number
  totalTiles: number
  explorationPercent: string
  badges: Badge[]
  monuments: Monument[]
  gpsActive: boolean
  onMove: (dir: 'north' | 'south' | 'east' | 'west') => void
  onStartGPS: () => void
  onStopGPS: () => void
  onReset: () => void
}

type Panel = 'none' | 'badges' | 'monuments'

export default function HUD({
  score, totalTiles, explorationPercent,
  badges, monuments, gpsActive,
  onMove, onStartGPS, onStopGPS, onReset
}: HUDProps) {
  const [panel, setPanel] = useState<Panel>('none')
  const earnedBadges = badges.filter(b => b.earned)
  const discoveredMonuments = monuments.filter(m => m.discovered)

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-[600] pointer-events-none">
        <div className="flex items-start justify-between p-3 gap-3">

          {/* Score panel */}
          <div className="hud-panel pointer-events-auto">
            <div className="text-[10px] tracking-[0.2em] text-cyan-400/60 uppercase mb-1">Exploration Points</div>
            <div className="text-2xl font-bold text-cyan-400 tabular-nums font-mono">{score.toLocaleString()}</div>
            <div className="flex gap-3 mt-2">
              <div>
                <div className="text-[9px] tracking-widest text-white/30 uppercase">Tiles</div>
                <div className="text-sm font-mono text-white/70">{totalTiles}</div>
              </div>
              <div>
                <div className="text-[9px] tracking-widest text-white/30 uppercase">Zone</div>
                <div className="text-sm font-mono text-white/70">{explorationPercent}%</div>
              </div>
              <div>
                <div className="text-[9px] tracking-widest text-white/30 uppercase">Sites</div>
                <div className="text-sm font-mono text-white/70">{discoveredMonuments.length}/{monuments.length}</div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 flex justify-center pt-1">
            <div className="text-center">
              <div className="text-xs tracking-[0.4em] text-white/20 uppercase">Project</div>
              <div className="text-lg font-bold tracking-[0.15em] text-white/80 uppercase font-mono">Terra Incognita</div>
            </div>
          </div>

          {/* GPS & menu */}
          <div className="flex flex-col gap-2 items-end pointer-events-auto">
            <button
              onClick={gpsActive ? onStopGPS : onStartGPS}
              className={`hud-btn text-xs px-3 py-1.5 ${gpsActive ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'text-cyan-400'}`}
            >
              {gpsActive ? '📡 GPS ON' : '📍 GPS'}
            </button>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPanel(p => p === 'badges' ? 'none' : 'badges')}
                className={`hud-btn text-xs px-2 py-1 ${panel === 'badges' ? 'bg-cyan-400/20' : ''}`}
              >
                🏅 {earnedBadges.length}
              </button>
              <button
                onClick={() => setPanel(p => p === 'monuments' ? 'none' : 'monuments')}
                className={`hud-btn text-xs px-2 py-1 ${panel === 'monuments' ? 'bg-cyan-400/20' : ''}`}
              >
                🏛️ {discoveredMonuments.length}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Badges panel */}
      {panel === 'badges' && (
        <div className="absolute top-20 left-3 z-[600] w-64 hud-panel pointer-events-auto max-h-[60vh] overflow-y-auto">
          <div className="text-[10px] tracking-[0.2em] text-cyan-400/60 uppercase mb-3">Badges</div>
          <div className="space-y-2">
            {badges.map(b => (
              <div key={b.id} className={`flex items-center gap-3 p-2 rounded border transition-all ${b.earned ? 'border-cyan-400/30 bg-cyan-400/5' : 'border-white/5 opacity-40'}`}>
                <span className="text-xl">{b.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold ${b.earned ? 'text-white' : 'text-white/40'}`}>{b.name}</div>
                  <div className="text-[10px] text-white/30 truncate">{b.description}</div>
                  {b.earnedAt && (
                    <div className="text-[9px] text-cyan-400/50 mt-0.5">
                      {new Date(b.earnedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {!b.earned && <span className="text-white/20 text-xs">🔒</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monuments panel */}
      {panel === 'monuments' && (
        <div className="absolute top-20 right-3 z-[600] w-72 hud-panel pointer-events-auto max-h-[60vh] overflow-y-auto">
          <div className="text-[10px] tracking-[0.2em] text-cyan-400/60 uppercase mb-3">
            Monuments — Paris {discoveredMonuments.length}/{monuments.length}
          </div>
          <div className="space-y-2">
            {monuments.map(m => (
              <div key={m.id} className={`flex items-center gap-3 p-2 rounded border transition-all ${m.discovered ? 'border-white/20 bg-white/5' : 'border-white/5'}`}>
                <div className="text-base">
                  {m.discovered ? (m.type === 'museum' ? '🏛️' : m.type === 'cathedral' ? '⛪' : '🗺️') : '❓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold ${m.discovered ? 'text-white' : 'text-white/25'}`}>
                    {m.discovered ? m.name : '??? Unknown Site'}
                  </div>
                  <div className="text-[9px] mt-0.5" style={{ color: RARITY_COLORS[m.rarity] }}>
                    {RARITY_LABELS[m.rarity]}
                  </div>
                </div>
                {m.discovered && <span className="text-green-400 text-xs">✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[600] pointer-events-auto">
        <div className="hud-panel">
          <div className="text-[9px] tracking-[0.2em] text-white/20 uppercase text-center mb-3">
            Navigate · Arrow keys supported
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button onClick={() => onMove('north')} className="nav-btn">▲</button>
            <div className="flex gap-1.5">
              <button onClick={() => onMove('west')} className="nav-btn">◀</button>
              <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center">
                <span className="text-cyan-400/40 text-xs">📍</span>
              </div>
              <button onClick={() => onMove('east')} className="nav-btn">▶</button>
            </div>
            <button onClick={() => onMove('south')} className="nav-btn">▼</button>
          </div>
          <div className="mt-3 flex justify-center">
            <button onClick={onReset} className="text-[9px] text-red-400/40 hover:text-red-400/70 tracking-widest uppercase transition-colors">
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
