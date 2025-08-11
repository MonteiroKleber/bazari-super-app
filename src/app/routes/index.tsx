import { createBrowserRouter } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from '@shared/components/Layout'
import { authRoutes } from './authRoutes'
import { profileRoutes } from './profileRoutes'

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
      
      // Rotas de autenticação (importadas)
      ...authRoutes,
      
      // Rotas de perfil (importadas)  
      ...profileRoutes,
      
      // TODO: Adicionar outras rotas das próximas etapas
      // ...marketplaceRoutes,
      // ...walletRoutes,
      // ...daoRoutes,
      
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