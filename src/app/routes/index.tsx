import { createBrowserRouter } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthGuard } from '@shared/guards/AuthGuard'
import { Layout } from '@shared/components/Layout'
import { authRoutes } from './authRoutes'
import { profileRoutes } from './profileRoutes'
import { marketplaceRoutes } from './marketplaceRoutes'
import { searchRoutes } from './searchRoutes'

// Páginas principais
const HomePage = lazy(() => import('@pages/Home').then(m => ({ default: m.default })))
const NotFoundPage = lazy(() => import('@pages/NotFound').then(m => ({ default: m.default })))
const DashboardPage = lazy(() => import('@pages/DashboardPage').then(m => ({ default: m.DashboardPage })))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Página inicial
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          </Suspense>
        )
      },
      
      // Rotas de autenticação
      ...authRoutes,
      
      // Rotas de perfil  
      ...profileRoutes,
      
      // Rotas de marketplace (importadas)
      ...marketplaceRoutes,

      // Rotas de busca (importadas)
      ...searchRoutes,

      // ❌ COMENTADO TEMPORARIAMENTE - será implementado na ETAPA 5
      // Rotas de marketplace (importadas)
      // ...marketplaceRoutes,

      // TODO: Adicionar outras rotas das próximas etapas quando implementadas
      // ...walletRoutes,      // ETAPA 6
      // ...socialRoutes,      // ETAPA 7  
      // ...daoRoutes,         // ETAPA 8
      // ...workRoutes,        // ETAPA 9

      // Página 404
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        )
      }
    ]
  }
], {
  // ✅ CRÍTICO: Flag que resolve o suspense
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
})