import { createBrowserRouter } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from '@shared/components/Layout'
import { AuthGuard } from '@shared/guards/AuthGuard'
import { RouteGuard } from '@shared/guards/RouteGuard'

// Lazy loading das páginas
const HomePage = lazy(() => import('@pages/Home').then(m => ({ default: m.default })))
const NotFoundPage = lazy(() => import('@pages/NotFound').then(m => ({ default: m.default })))

// Auth pages
const LoginPage = lazy(() => import('@pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ImportAccountPage = lazy(() => import('@pages/auth/ImportAccountPage').then(m => ({ default: m.ImportAccountPage })))
const RecoveryPage = lazy(() => import('@pages/auth/RecoveryPage').then(m => ({ default: m.RecoveryPage })))

// Profile pages
const MyProfilePage = lazy(() => import('@pages/profile/MyProfilePage').then(m => ({ default: m.MyProfilePage })))
const EditProfilePage = lazy(() => import('@pages/profile/EditProfilePage').then(m => ({ default: m.EditProfilePage })))
const PublicProfilePage = lazy(() => import('@pages/profile/PublicProfilePage').then(m => ({ default: m.PublicProfilePage })))
const SearchUsersPage = lazy(() => import('@pages/profile/SearchUsersPage').then(m => ({ default: m.SearchUsersPage })))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Rota raiz redireciona para home
      {
        index: true,
        element: <HomePage />
      },
      
      // Rotas de autenticação (SEM Layout)
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: (
              <RouteGuard requireNoAuth fallbackNoAuth="/profile">
                <Suspense fallback={<PageLoader />}>
                  <LoginPage />
                </Suspense>
              </RouteGuard>
            )
          },
          {
            path: 'register',
            element: (
              <RouteGuard requireNoAuth fallbackNoAuth="/profile">
                <Suspense fallback={<PageLoader />}>
                  <RegisterPage />
                </Suspense>
              </RouteGuard>
            )
          },
          {
            path: 'import',
            element: (
              <RouteGuard requireNoAuth fallbackNoAuth="/profile">
                <Suspense fallback={<PageLoader />}>
                  <ImportAccountPage />
                </Suspense>
              </RouteGuard>
            )
          },
          {
            path: 'recovery',
            element: (
              <RouteGuard requireNoAuth fallbackNoAuth="/profile">
                <Suspense fallback={<PageLoader />}>
                  <RecoveryPage />
                </Suspense>
              </RouteGuard>
            )
          }
        ]
      },
      
      // Rotas de perfil (COM Layout)
      {
        path: 'profile',
        children: [
          {
            index: true,
            element: (
              <AuthGuard>
                <Suspense fallback={<PageLoader />}>
                  <MyProfilePage />
                </Suspense>
              </AuthGuard>
            )
          },
          {
            path: 'edit',
            element: (
              <AuthGuard>
                <Suspense fallback={<PageLoader />}>
                  <EditProfilePage />
                </Suspense>
              </AuthGuard>
            )
          },
          {
            path: ':userId',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PublicProfilePage />
              </Suspense>
            )
          }
        ]
      },
      
      // Rota de busca
      {
        path: 'search/users',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchUsersPage />
          </Suspense>
        )
      },
      
      // Página 404
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
])