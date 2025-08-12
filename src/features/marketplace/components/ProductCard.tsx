import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '@entities/product'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  showBusiness?: boolean
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showBusiness = true
}) => {
  const mainImage = product.images.find(img => img.isMain) || product.images[0]
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: product.currency === 'BRL' ? 'BRL' : 'USD'
    }).format(price)
  }

  return (
    <Card hover className="group">
      <div className="relative">
        {/* Imagem do Produto */}
        <Link to={`/marketplace/product/${product.id}`}>
          <div className="aspect-square overflow-hidden rounded-t-lg">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Icons.Image className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product.isTokenized && (
            <Badge variant="primary" size="sm">
              <Icons.Star className="w-3 h-3 mr-1" />
              NFT
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="warning" size="sm">
              Destaque
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="error" size="sm">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Favorito */}
        <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Icons.Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      <div className="p-4">
        {/* Nome do Produto */}
        <Link to={`/marketplace/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Descrição Curta */}
        {product.shortDescription && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        )}

        {/* Preço */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
          {product.currency === 'BZR' && (
            <Badge variant="primary" size="sm">BZR</Badge>
          )}
        </div>

        {/* Rating e Vendas */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icons.Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewCount})
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {product.totalSales} vendas
          </span>
        </div>

        {/* Estoque */}
        {product.trackInventory && (
          <div className="mb-3">
            {product.stock > 0 ? (
              <span className={`text-sm ${
                product.stock < 10 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {product.stock < 10 ? `Apenas ${product.stock} restantes` : 'Em estoque'}
              </span>
            ) : (
              <span className="text-sm text-red-600">Fora de estoque</span>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="space-y-2">
          <Button
            onClick={() => onAddToCart?.(product.id)}
            disabled={product.trackInventory && product.stock === 0}
            className="w-full"
            size="sm"
          >
            <Icons.ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
          
          {showBusiness && (
            <Link to={`/marketplace/business/${product.businessId}`}>
              <Button variant="secondary" size="sm" className="w-full">
                Ver Loja
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
