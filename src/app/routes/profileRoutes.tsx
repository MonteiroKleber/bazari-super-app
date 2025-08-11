import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { AuthGuard } from '@shared/guards/AuthGuard'

// Lazy load das páginas
const MyProfilePage = lazy(() => import('@pages/profile/MyProfilePage').then(m => ({ default: m.MyProfilePage })))
const EditProfilePage = lazy(() => import('@pages/profile/EditProfilePage').then(m => ({ default: m.EditProfilePage })))
const PublicProfilePage = lazy(() => import('@pages/profile/PublicProfilePage').then(m => ({ default: m.PublicProfilePage })))
const SearchUsersPage = lazy(() => import('@pages/profile/SearchUsersPage').then(m => ({ default: m.SearchUsersPage })))

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    children: [
      {
        index: true,
        element: (
          <AuthGuard>
            <MyProfilePage />
          </AuthGuard>
        )
      },
      {
        path: 'edit',
        element: (
          <AuthGuard>
            <EditProfilePage />
          </AuthGuard>
        )
      },
      {
        path: ':userId',
        element: <PublicProfilePage />
      }
    ]
  },
  {
    path: '/search',
    children: [
      {
        path: 'users',
        element: <SearchUsersPage />
      }
    ]
  }
]