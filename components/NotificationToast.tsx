'use client'

import { Notification } from '@/types/game'
import { RARITY_COLORS, RARITY_LABELS } from '@/lib/constants'

interface NotificationToastProps {
  notifications: Notification[]
}

export default function NotificationToast({ notifications }: NotificationToastProps) {
  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[700] flex flex-col gap-2 items-center pointer-events-none">
      {notifications.map(n => (
        <div
          key={n.id}
          className="notification-toast"
          style={{
            borderColor: n.rarity ? RARITY_COLORS[n.rarity] + '60' : undefined,
            boxShadow: n.rarity ? `0 0 20px ${RARITY_COLORS[n.rarity]}30` : undefined,
          }}
        >
          {n.type === 'monument' && (
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="text-[9px] tracking-[0.2em] text-white/40 uppercase">Monument Discovered</div>
                <div className="text-sm font-bold text-white">{n.title}</div>
                {n.rarity && (
                  <div className="text-[10px] mt-0.5" style={{ color: RARITY_COLORS[n.rarity] }}>
                    {RARITY_LABELS[n.rarity]} · +{n.points} XP
                  </div>
                )}
              </div>
            </div>
          )}
          {n.type === 'badge' && (
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-badge-pop">{n.icon}</div>
              <div>
                <div className="text-[9px] tracking-[0.2em] text-cyan-400/60 uppercase">Badge Earned</div>
                <div className="text-sm font-bold text-white">{n.title}</div>
                <div className="text-[10px] text-white/40">{n.subtitle}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
