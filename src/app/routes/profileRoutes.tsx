import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { AuthGuard } from '@shared/guards/AuthGuard'

// Lazy load das páginas de perfil
const MyProfilePage = lazy(() => import('@pages/profile/MyProfilePage').then(m => ({ default: m.MyProfilePage })))
const EditProfilePage = lazy(() => import('@pages/profile/EditProfilePage').then(m => ({ default: m.EditProfilePage })))
const PublicProfilePage = lazy(() => import('@pages/profile/PublicProfilePage').then(m => ({ default: m.PublicProfilePage })))
const SearchUsersPage = lazy(() => import('@pages/profile/SearchUsersPage').then(m => ({ default: m.SearchUsersPage })))

// ✅ PageLoader para perfil
const ProfilePageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando perfil...</p>
    </div>
  </div>
)

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: (
      <AuthGuard>
        <Suspense fallback={<ProfilePageLoader />}>
          <MyProfilePage />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/profile/edit',
    element: (
      <AuthGuard>
        <Suspense fallback={<ProfilePageLoader />}>
          <EditProfilePage />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/profile/:userId',
    element: (
      <Suspense fallback={<ProfilePageLoader />}>
        <PublicProfilePage />
      </Suspense>
    )
  },
  {
    path: '/search/users',
    element: (
      <Suspense fallback={<ProfilePageLoader />}>
        <SearchUsersPage />
      </Suspense>
    )
  }
]