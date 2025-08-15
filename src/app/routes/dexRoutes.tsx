// src/app/routes/dexRoutes.tsx

import { RouteObject } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthGuard } from '@shared/guards/AuthGuard'

// Lazy imports das páginas DEX
const DexHome = lazy(() => import('@pages/dex').then(m => ({ default: m.DexHome })))
const DexSwap = lazy(() => import('@pages/dex').then(m => ({ default: m.DexSwap })))
const DexPools = lazy(() => import('@pages/dex').then(m => ({ default: m.DexPools })))
const DexPoolDetail = lazy(() => import('@pages/dex').then(m => ({ default: m.DexPoolDetail })))
const DexCreatePool = lazy(() => import('@pages/dex').then(m => ({ default: m.DexCreatePool })))
const DexRewards = lazy(() => import('@pages/dex').then(m => ({ default: m.DexRewards })))

// Loader component para DEX
const DexLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Carregando DEX...</p>
    </div>
  </div>
)

// Configuração das rotas DEX
export const dexRoutes: RouteObject[] = [
  {
    path: '/dex',
    element: (
      <AuthGuard>
        <Suspense fallback={<DexLoader />}>
          <DexHome />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dex/swap',
    element: (
      <AuthGuard>
        <Suspense fallback={<DexLoader />}>
          <DexSwap />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dex/pools',
    element: (
      <AuthGuard>
        <Suspense fallback={<DexLoader />}>
          <DexPools />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dex/pools/:id',
    element: (
      <AuthGuard>
        <Suspense fallback={<DexLoader />}>
          <DexPoolDetail />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dex/create',
    element: (
      <AuthGuard>
        <Suspense fallback={<DexLoader />}>
          <DexCreatePool />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dex/rewards',
    element: (
      <AuthGuard>
        <Suspense fallback={<DexLoader />}>
          <DexRewards />
        </Suspense>
      </AuthGuard>
    )
  }
]