// src/features/marketplace/components/ProductCard.tsx
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'
import { Product } from '@entities/product'
import { DigitalBadge, RoyaltyChip, LicensePill } from './digital'

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  showDigitalBadges?: boolean
  className?: string
}

const formatPrice = (price: number, currency: string = 'BZR'): string => {
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: currency === 'BZR' ? 1 : 2,
    maximumFractionDigits: currency === 'BZR' ? 2 : 2
  }).format(price)
  
  return `${formatted} ${currency}`
}

export const ProductCard: FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  showDigitalBadges = false,
  className = '' 
}) => {
  const mainImage = product.images.find(img => img.isMain) || product.images[0]
  const isInStock = product.isUnlimited || product.stock > 0
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart(product.id)
  }

  const linkPath = product.isDigital 
    ? `/marketplace/digitais/produto/${product.id}`
    : `/marketplace/product/${product.id}`

  return (
    <Link to={linkPath} className={`group ${className}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        
        {/* Image Container */}
        <div className="relative">
          <img 
            src={mainImage?.url || 'https://picsum.photos/400/300'} 
            alt={mainImage?.alt || product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {/* Badges padrão */}
            {product.isFeatured && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Icons.Star className="w-3 h-3 mr-1" />
                Destaque
              </Badge>
            )}
            
            {product.isTokenized && !showDigitalBadges && (
              <Badge variant="secondary">
                <Icons.Shield className="w-3 h-3 mr-1" />
                Tokenizado
              </Badge>
            )}

            {!isInStock && (
              <Badge variant="destructive">
                Fora de Estoque
              </Badge>
            )}

            {discountPercent > 0 && (
              <Badge className="bg-red-100 text-red-800">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Badges Digitais (somente se showDigitalBadges=true) */}
          {showDigitalBadges && product.isDigital && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.isTokenized && <DigitalBadge />}
              {product.royaltiesPct && <RoyaltyChip percentage={product.royaltiesPct} />}
              {product.license && <LicensePill license={product.license} />}
            </div>
          )}

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2">
            <div className="bg-white bg-opacity-90 rounded-lg px-2 py-1">
              <span className="text-sm font-bold text-gray-900">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-1">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            {product.shortDescription && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Rating and Reviews */}
          {product.rating > 0 && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Icons.Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Informações específicas de digitais */}
          {showDigitalBadges && product.isDigital && (
            <div className="mb-3 space-y-1">
              {product.license && (
                <div className="flex items-center text-xs text-gray-600">
                  <Icons.Clock className="w-3 h-3 mr-1" />
                  Licença: {
                    product.license === 'lifetime' ? 'Vitalícia' : 
                    product.license === 'days30' ? '30 dias' : '90 dias'
                  }
                </div>
              )}
              
              {product.onchain && (
                <div className="flex items-center text-xs text-gray-600">
                  <Icons.Shield className="w-3 h-3 mr-1" />
                  Token: {product.onchain.tokenId.substring(0, 12)}...
                </div>
              )}
            </div>
          )}

          {/* Stock Status */}
          {!product.isUnlimited && (
            <div className="mb-3">
              {product.stock <= 5 && product.stock > 0 ? (
                <span className="text-xs text-orange-600 font-medium">
                  Apenas {product.stock} restantes
                </span>
              ) : !isInStock ? (
                <span className="text-xs text-red-600 font-medium">
                  Fora de estoque
                </span>
              ) : (
                <span className="text-xs text-green-600 font-medium">
                  Em estoque
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock}
              size="sm"
              className="flex-1"
            >
              <Icons.ShoppingCart className="w-4 h-4 mr-1" />
              {product.isDigital ? 'Comprar' : 'Carrinho'}
            </Button>
            
            {product.isDigital && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(`app://dex/produto/${product.id}`, '_blank')
                }}
              >
                <Icons.TrendingUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

      </Card>
    </Link>
  )
}