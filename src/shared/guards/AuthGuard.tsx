
// BEGIN ETAPA3-AUTH
import { FC, ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback?: string
}

export const AuthGuard: FC<AuthGuardProps> = ({ children, fallback = '/auth/login' }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />
  }

  return <>{children}</>
}
// END ETAPA3-AUTH

