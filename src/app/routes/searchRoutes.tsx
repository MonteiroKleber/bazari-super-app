// src/app/routes/searchRoutes.tsx
import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

// 👇 lazy import da página já existente
const SearchUsersPage = lazy(() =>
  import('@pages/profile/SearchUsersPage').then(m => ({ default: m.SearchUsersPage }))
)

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-64 bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-3"></div>
      <p className="text-gray-600 text-sm">Carregando busca…</p>
    </div>
  </div>
)

export const searchRoutes: RouteObject[] = [
  {
    path: '/search',
    children: [
      {
        path: 'users',
        element: (
          <Suspense fallback={<RouteLoader />}>
            <SearchUsersPage />
          </Suspense>
        ),
      },
    ],
  },
]
