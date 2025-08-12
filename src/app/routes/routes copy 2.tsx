import { createBrowserRouter } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from '@shared/components/Layout'
import { authRoutes } from './authRoutes'
import { profileRoutes } from './profileRoutes'
import { marketplaceRoutes } from './marketplaceRoutes'

// Páginas principais
const HomePage = lazy(() => import('@pages/Home').then(m => ({ default: m.default })))
const NotFoundPage = lazy(() => import('@pages/NotFound').then(m => ({ default: m.default })))

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
      // Página inicial
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        )
      },
      
      // ✅ ROTAS DE AUTENTICAÇÃO ATIVAS
      ...authRoutes,
      
      // ✅ ROTAS DE PERFIL ATIVAS
      ...profileRoutes,
      
      // ✅ ROTAS DE MARKETPLACE ATIVAS
      ...marketplaceRoutes,
      
      // TODO: Próximas etapas
      // ...walletRoutes, (ETAPA 6)
      // ...socialRoutes, (ETAPA 7)
      // ...daoRoutes, (ETAPA 8)
      
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
])