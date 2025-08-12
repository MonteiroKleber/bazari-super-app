import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { AuthGuard } from '@shared/guards/AuthGuard'

// Lazy load das páginas
const MarketplacePage = lazy(() => import('@pages/marketplace/MarketplacePage').then(m => ({ default: m.MarketplacePage })))
const ProductDetailPage = lazy(() => import('@pages/marketplace/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })))
const BusinessDetailPage = lazy(() => import('@pages/marketplace/BusinessDetailPage').then(m => ({ default: m.BusinessDetailPage })))
const CreateBusinessPage = lazy(() => import('@pages/marketplace/CreateBusinessPage').then(m => ({ default: m.CreateBusinessPage })))
const CreateProductPage = lazy(() => import('@pages/marketplace/CreateProductPage').then(m => ({ default: m.CreateProductPage })))

export const marketplaceRoutes: RouteObject[] = [
  // Marketplace principal (público)
  {
    path: 'marketplace',
    children: [
      {
        index: true,
        element: <MarketplacePage />
      },
      
      // Detalhes do produto (público)
      {
        path: 'product/:id',
        element: <ProductDetailPage />
      },
      
      // Detalhes do negócio (público)
      {
        path: 'business/:id',
        element: <BusinessDetailPage />
      },
      
      // Criar negócio (protegido)
      {
        path: 'create-business',
        element: (
          <AuthGuard>
            <CreateBusinessPage />
          </AuthGuard>
        )
      },
      
      // Criar produto (protegido)
      {
        path: 'business/:businessId/create-product',
        element: (
          <AuthGuard>
            <CreateProductPage />
          </AuthGuard>
        )
      }
    ]
  }
]
