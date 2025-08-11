import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { RouteGuard } from '@shared/guards/RouteGuard'

// Lazy load das páginas
const LoginPage = lazy(() => import('@pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ImportAccountPage = lazy(() => import('@pages/auth/ImportAccountPage').then(m => ({ default: m.ImportAccountPage })))
const RecoveryPage = lazy(() => import('@pages/auth/RecoveryPage').then(m => ({ default: m.RecoveryPage })))

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <RouteGuard requireNoAuth fallbackNoAuth="/profile">
            <LoginPage />
          </RouteGuard>
        )
      },
      {
        path: 'register',
        element: (
          <RouteGuard requireNoAuth fallbackNoAuth="/profile">
            <RegisterPage />
          </RouteGuard>
        )
      },
      {
        path: 'import',
        element: (
          <RouteGuard requireNoAuth fallbackNoAuth="/profile">
            <ImportAccountPage />
          </RouteGuard>
        )
      },
      {
        path: 'recovery',
        element: (
          <RouteGuard requireNoAuth fallbackNoAuth="/profile">
            <RecoveryPage />
          </RouteGuard>
        )
      }
    ]
  }
]