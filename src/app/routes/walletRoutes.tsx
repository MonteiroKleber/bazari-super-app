// src/app/routes/walletRoutes.tsx

import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'

// Loading component para as rotas de wallet
const WalletLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Carregando wallet...</p>
    </div>
  </div>
)

// Lazy load das páginas de wallet
const WalletHome = lazy(() => import('@pages/wallet/WalletHome').then(m => ({ default: m.WalletHome })))
const WalletStaking = lazy(() => import('@pages/wallet/WalletStaking').then(m => ({ default: m.WalletStaking })))
const WalletHistory = lazy(() => import('@pages/wallet/WalletHistory').then(m => ({ default: m.WalletHistory })))
const WalletAccounts = lazy(() => import('@pages/wallet/WalletAccounts').then(m => ({ default: m.WalletAccounts })))

export const walletRoutes: RouteObject[] = [
  {
    path: 'wallet',
    children: [
      // Dashboard da wallet - /wallet
      {
        index: true,
        element: (
          <Suspense fallback={<WalletLoader />}>
            <WalletHome />
          </Suspense>
        )
      },
      
      // Staking/Delegação - /wallet/staking
      {
        path: 'staking',
        element: (
          <Suspense fallback={<WalletLoader />}>
            <WalletStaking />
          </Suspense>
        )
      },
      
      // Histórico de transações - /wallet/history
      {
        path: 'history',
        element: (
          <Suspense fallback={<WalletLoader />}>
            <WalletHistory />
          </Suspense>
        )
      },
      
      // Gerenciar contas - /wallet/accounts
      {
        path: 'accounts',
        element: (
          <Suspense fallback={<WalletLoader />}>
            <WalletAccounts />
          </Suspense>
        )
      }
    ]
  }
]