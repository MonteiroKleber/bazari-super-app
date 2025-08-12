import { FC, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { marketplaceService } from '@features/marketplace/services/marketplaceService'
import { useBusiness } from '@features/marketplace/hooks/useBusiness'
import { useMarketplace } from '@features/marketplace/hooks/useMarketplace'
import { Product } from '@entities/product'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

export const ProductDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const { business, loadBusiness } = useBusiness()
  const { addToCart } = useMarketplace()

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return
      
      setIsLoading(true)
      try {
        const productData = await marketplaceService.getProduct(id)
        setProduct(productData)
        
        if (productData) {
          await loadBusiness(productData.businessId)
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id, loadBusiness])

  const handleAddToCart = async () => {
    if (!product) return
    
    const success = await addToCart(product.id, quantity)
    if (success) {
      // TODO: Show success notification
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: product?.currency === 'BRL' ? 'BRL' : 'USD'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icons.Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h1>
          <p className="text-gray-600 mb-4">O produto que você procura não existe ou foi removido.</p>
          <Button onClick={() => navigate('/marketplace')}>
            Voltar ao Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <button onClick={() => navigate('/marketplace')} className="text-primary-600 hover:text-primary-700">
            Marketplace
          </button>
          <Icons.ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{product.category}</span>
          <Icons.ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="aspect-square overflow-hidden rounded-lg border">
              {product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]?.url}
                  alt={product.images[selectedImageIndex]?.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Icons.Image className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {product.isTokenized && (
                  <Badge variant="primary">
                    <Icons.Star className="w-3 h-3 mr-1" />
                    NFT
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge variant="warning">Destaque</Badge>
                )}
                {hasDiscount && (
                  <Badge variant="error">-{discountPercent}%</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              {product.shortDescription && (
                <p className="text-lg text-gray-600">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Preço */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
              {product.currency === 'BZR' && (
                <Badge variant="primary">BZR</Badge>
              )}
            </div>

            {/* Rating e Vendas */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount} avaliações)
                </span>
              </div>
              
              <span className="text-gray-600">
                {product.totalSales} vendas
              </span>
            </div>

            {/* Estoque */}
            {product.trackInventory && (
              <div className="flex items-center space-x-2">
                <Icons.Package className="w-5 h-5 text-gray-400" />
                <span className={`text-sm ${
                  product.stock > 0 
                    ? product.stock < 10 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {product.stock > 0 
                    ? product.stock < 10 
                      ? `Apenas ${product.stock} restantes` 
                      : 'Em estoque'
                    : 'Fora de estoque'
                  }
                </span>
              </div>
            )}

            {/* Quantidade e Compra */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantidade:
                </label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Icons.Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.trackInventory && quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Icons.Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.trackInventory && product.stock === 0}
                  className="w-full"
                  size="lg"
                >
                  <Icons.ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                
                <Button variant="secondary" className="w-full" size="lg">
                  Comprar Agora
                </Button>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descrição e Negócio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Descrição */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Descrição</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Informações do Negócio */}
          {business && (
            <div>
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Vendido por</h3>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      {business.logoUrl ? (
                        <img
                          src={business.logoUrl}
                          alt={business.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icons.Building className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{business.name}</h4>
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Icons.Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(business.rating)
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({business.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {business.description}
                  </p>

                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/marketplace/business/${business.id}`)}
                    className="w-full"
                  >
                    Ver Loja
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
