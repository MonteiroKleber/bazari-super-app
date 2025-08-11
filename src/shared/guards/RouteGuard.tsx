
// BEGIN ETAPA3-AUTH
import { FC, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

interface RouteGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireNoAuth?: boolean
  fallbackAuth?: string
  fallbackNoAuth?: string
}

export const RouteGuard: FC<RouteGuardProps> = ({
  children,
  requireAuth = false,
  requireNoAuth = false,
  fallbackAuth = '/auth/login',
  fallbackNoAuth = '/dashboard'
}) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) return <Navigate to={fallbackAuth} replace />
  if (requireNoAuth && isAuthenticated) return <Navigate to={fallbackNoAuth} replace />
  return <>{children}</>
}
// END ETAPA3-AUTH

