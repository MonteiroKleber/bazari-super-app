// src/features/auth/components/AuthSessionManager.tsx
import { useEffect, useRef } from 'react'
import { useAuth } from '@features/auth/hooks/useAuth'

const HEARTBEAT_MS = 5 * 60 * 1000 // 5min
const IDLE_LIMIT_MS = 30 * 60 * 1000 // 30min

export function AuthSessionManager() {
  const { isAuthenticated, refreshSession, logout, currentSession } = useAuth()
  const lastInteractionRef = useRef<number>(Date.now())

  useEffect(() => {
    const touched = () => (lastInteractionRef.current = Date.now())
    const events = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']
    events.forEach((ev) => window.addEventListener(ev, touched))
    return () => events.forEach((ev) => window.removeEventListener(ev, touched))
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => {
      const idle = Date.now() - lastInteractionRef.current
      if (idle >= IDLE_LIMIT_MS) {
        logout()
      } else {
        refreshSession()
      }
    }, HEARTBEAT_MS)
    return () => clearInterval(interval)
  }, [isAuthenticated, refreshSession, logout])

  // opcional: sincronizar ref com lastActivity vinda da store
  useEffect(() => {
    if (currentSession?.lastActivity) {
      lastInteractionRef.current = new Date(currentSession.lastActivity).getTime()
    }
  }, [currentSession?.lastActivity])

  return null
}
