import { FC } from 'react'
import { ProductCard } from '@features/marketplace/components/ProductCard'
import { Button } from '@shared/ui/Button'
import { Icons } from '@shared/ui/Icons'
import { Product } from '@entities/product'

interface DigitalProductGridProps {
  products: Product[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onAddToCart?: (productId: string) => void
  emptyMessage?: string
}

export const DigitalProductGrid: FC<DigitalProductGridProps> = ({
  products,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onAddToCart = () => {},
  emptyMessage = 'Nenhum produto digital encontrado'
}) => {
  
  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <Icons.Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-600">
          Tente ajustar os filtros ou termos de busca
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            showDigitalBadges={true}
          />
        ))}
        
        {/* Loading Skeleton */}
        {isLoading && (
          <>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="text-center">
          <Button 
            onClick={onLoadMore} 
            variant="outline"
            size="lg"
          >
            <Icons.ChevronDown className="w-4 h-4 mr-2" />
            Carregar Mais Produtos
          </Button>
        </div>
      )}
      
    </div>
  )
}