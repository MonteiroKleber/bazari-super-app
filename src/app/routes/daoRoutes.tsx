// src/app/routes/daoRoutes.tsx

import { RouteObject } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthGuard } from '@shared/guards/AuthGuard'

// Lazy imports das páginas DAO
const DaoHome = lazy(() => import('@pages/dao').then(m => ({ default: m.DaoHome })))
const DaoProposals = lazy(() => import('@pages/dao').then(m => ({ default: m.DaoProposals })))
const DaoProposalDetail = lazy(() => import('@pages/dao').then(m => ({ default: m.DaoProposalDetail })))
const DaoCreateProposal = lazy(() => import('@pages/dao').then(m => ({ default: m.DaoCreateProposal })))
const DaoVotes = lazy(() => import('@pages/dao').then(m => ({ default: m.DaoVotes })))
const DaoTreasury = lazy(() => import('@pages/dao').then(m => ({ default: m.DaoTreasury })))

// Loader component para DAO
const DaoLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Carregando DAO...</p>
    </div>
  </div>
)

// Configuração das rotas DAO
export const daoRoutes: RouteObject[] = [
  {
    path: '/dao',
    element: (
      <AuthGuard>
        <Suspense fallback={<DaoLoader />}>
          <DaoHome />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dao/proposals',
    element: (
      <AuthGuard>
        <Suspense fallback={<DaoLoader />}>
          <DaoProposals />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dao/proposals/:id',
    element: (
      <AuthGuard>
        <Suspense fallback={<DaoLoader />}>
          <DaoProposalDetail />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dao/create',
    element: (
      <AuthGuard>
        <Suspense fallback={<DaoLoader />}>
          <DaoCreateProposal />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dao/votes',
    element: (
      <AuthGuard>
        <Suspense fallback={<DaoLoader />}>
          <DaoVotes />
        </Suspense>
      </AuthGuard>
    )
  },
  {
    path: '/dao/treasury',
    element: (
      <AuthGuard>
        <Suspense fallback={<DaoLoader />}>
          <DaoTreasury />
        </Suspense>
      </AuthGuard>
    )
  }
]