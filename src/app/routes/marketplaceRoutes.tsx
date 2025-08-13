import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { AuthGuard } from '@shared/guards/AuthGuard'

// Lazy load das páginas
const MarketplacePage = lazy(() => import('@pages/marketplace/MarketplacePage').then(m => ({ default: m.MarketplacePage })))
const ProductDetailPage = lazy(() => import('@pages/marketplace/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })))
const BusinessDetailPage = lazy(() => import('@pages/marketplace/BusinessDetailPage').then(m => ({ default: m.BusinessDetailPage })))
const CreateBusinessPage = lazy(() => import('@pages/marketplace/CreateBusinessPage').then(m => ({ default: m.CreateBusinessPage })))
const CreateProductPage = lazy(() => import('@pages/marketplace/CreateProductPage').then(m => ({ default: m.CreateProductPage })))

// 🎯 ERROR BOUNDARY LOCAL PARA MARKETPLACE
const MarketplaceErrorBoundary = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Erro no Marketplace
      </h2>
      <p className="text-gray-600 mb-6">
        Ocorreu um erro ao carregar o marketplace. Tente recarregar a página.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Recarregar Página
        </button>
        <button
          onClick={() => window.history.back()}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  </div>
)

// 🎯 LOADING FALLBACK PARA ROTAS LAZY
const RouteLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
)

export const marketplaceRoutes: RouteObject[] = [
  // Marketplace principal (público)
  {
    path: 'marketplace',
    // 🔧 CORREÇÃO: Error boundary específico apenas para o marketplace
    errorElement: <MarketplaceErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoader />}>
            <MarketplacePage />
          </Suspense>
        ),
        // 🔧 Error boundary adicional na rota principal do marketplace
        errorElement: <MarketplaceErrorBoundary />
      },
      
      // Detalhes do produto (público)
      {
        path: 'product/:id',
        element: (
          <Suspense fallback={<RouteLoader />}>
            <ProductDetailPage />
          </Suspense>
        )
      },
      
      // Detalhes do negócio (público)
      {
        path: 'business/:id',
        element: (
          <Suspense fallback={<RouteLoader />}>
            <BusinessDetailPage />
          </Suspense>
        )
      },
      
      // Criar negócio (protegido)
      {
        path: 'create-business',
        element: (
          <Suspense fallback={<RouteLoader />}>
            <AuthGuard>
              <CreateBusinessPage />
            </AuthGuard>
          </Suspense>
        )
      },
      
      // Criar produto (protegido)
      {
        path: 'business/:businessId/create-product',
        element: (
          <Suspense fallback={<RouteLoader />}>
            <AuthGuard>
              <CreateProductPage />
            </AuthGuard>
          </Suspense>
        )
      }
    ]
  }
]