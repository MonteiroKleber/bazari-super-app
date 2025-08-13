import { FC, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Product } from '@entities/product'
import { Business } from '@entities/business'
import { Button, Badge, Card, Icons } from '@shared/ui'

export const ProductDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Helper para renderizar estrelas com segurança
  const renderStars = (rating: number | undefined, size = 'w-5 h-5') => {
    const safeRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0
    const filledStars = Math.floor(Math.min(safeRating, 5))
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => (
          <Icons.Star
            key={`star-${index}`}
            className={`${size} ${
              index < filledStars
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  // Helper para formatar preço com segurança
  const formatPrice = (price: number | undefined, currency = 'BRL') => {
    const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency === 'BRL' ? 'BRL' : 'USD'
      }).format(safePrice)
    } catch {
      return `R$ ${safePrice.toFixed(2)}`
    }
  }

  // Helper para validar string
  const safeString = (value: unknown, fallback = '') => {
    return typeof value === 'string' ? value : fallback
  }

  // Helper para validar número
  const safeNumber = (value: unknown, fallback = 0) => {
    return typeof value === 'number' && !isNaN(value) ? value : fallback
  }

  // Carregar dados do produto (mock)
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return
      
      setIsLoading(true)
      
      // Mock data
      const mockProduct: Product = {
        id: id,
        businessId: 'biz-1',
        name: 'Camiseta Personalizada Web3',
        description: 'Camiseta de alta qualidade com estampa exclusiva do mundo Web3. Feita com algodão 100% orgânico e tinta ecológica. Perfeita para mostrar seu apoio à descentralização.',
        shortDescription: 'Camiseta premium com estampa Web3 exclusiva',
        price: 89.90,
        originalPrice: 129.90,
        currency: 'BRL',
        category: 'Roupas',
        subcategory: 'Camisetas',
        tags: ['Web3', 'Blockchain', 'Algodão Orgânico', 'Sustentável'],
        images: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
            alt: 'Camiseta Web3 - Frente',
            isMain: true,
            order: 0
          },
          {
            id: '2', 
            url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
            alt: 'Camiseta Web3 - Costas',
            isMain: false,
            order: 1
          }
        ],
        stock: 15,
        isUnlimited: false,
        trackInventory: true,
        isTokenized: true,
        tokenId: 'NFT-001',
        isNFT: true,
        isActive: true,
        isFeatured: true,
        isDigital: false,
        rating: 4.8,
        reviewCount: 127,
        totalSales: 340,
        views: 1250,
        slug: 'camiseta-web3-premium',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      }

      const mockBusiness: Business = {
        id: 'biz-1',
        name: 'Web3 Fashion',
        description: 'Loja especializada em roupas e acessórios com temática Web3 e blockchain.',
        ownerAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        category: {
          id: 'fashion',
          name: 'Moda',
          level: 1
        },
        address: {
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          zipCode: '01234-567'
        },
        logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        isTokenized: true,
        rating: 4.9,
        reviewCount: 89,
        totalSales: 1250,
        verificationLevel: 'verified',
        isActive: true,
        isVerified: true,
        isFeatured: true,
        followers: 2340,
        tags: ['Web3', 'Fashion', 'Sustentável'],
        createdAt: new Date('2023-05-10'),
        updatedAt: new Date('2024-01-20')
      }

      // Simular delay de carregamento
      setTimeout(() => {
        setProduct(mockProduct)
        setBusiness(mockBusiness)
        setIsLoading(false)
      }, 1000)
    }

    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    // Lógica do carrinho aqui
    console.log(`Adicionado ao carrinho: ${product.name} x${quantity}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F1E0] flex items-center justify-center">
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
    <div className="min-h-screen bg-[#F5F1E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/marketplace')} className="hover:text-[#8B0000]">
            Marketplace
          </button>
          <Icons.ArrowRight className="w-4 h-4" />
          <span className="text-gray-900">{safeString(product.name)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
              <img
                src={product.images?.[selectedImageIndex]?.url || '/placeholder-product.png'}
                alt={product.images?.[selectedImageIndex]?.alt || safeString(product.name)}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Miniaturas */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? 'border-[#8B0000]'
                        : 'border-gray-200'
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
            {/* Badges */}
            <div className="flex items-center space-x-2">
              {product.isTokenized && (
                <Badge variant="primary">
                  <Icons.Package className="w-3 h-3 mr-1" />
                  NFT
                </Badge>
              )}
              {product.isFeatured && (
                <Badge variant="warning">Destaque</Badge>
              )}
              {hasDiscount && (
                <Badge variant="danger">-{discountPercent}%</Badge>
              )}
            </div>
            
            {/* Nome */}
            <h1 className="text-3xl font-bold text-gray-900">
              {safeString(product.name)}
            </h1>
            
            {/* Descrição Curta */}
            {product.shortDescription && (
              <p className="text-lg text-gray-600">
                {safeString(product.shortDescription)}
              </p>
            )}

            {/* Preço */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price, product.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
              {product.currency === 'BZR' && (
                <Badge variant="primary">BZR</Badge>
              )}
            </div>

            {/* Rating e Vendas */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
                <span className="text-gray-600">
                  {safeNumber(product.rating).toFixed(1)} ({safeNumber(product.reviewCount)} avaliações)
                </span>
              </div>
              
              <span className="text-gray-600">
                {safeNumber(product.totalSales)} vendas
              </span>
            </div>

            {/* Estoque */}
            {product.trackInventory && (
              <div className="flex items-center space-x-2">
                <Icons.Package className="w-5 h-5 text-gray-400" />
                <span className={`text-sm ${
                  safeNumber(product.stock) > 0 
                    ? safeNumber(product.stock) < 10 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {safeNumber(product.stock) > 0 
                    ? safeNumber(product.stock) < 10 
                      ? `Apenas ${safeNumber(product.stock)} restantes` 
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
                    <Icons.ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.trackInventory && quantity >= safeNumber(product.stock)}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Icons.Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.trackInventory && safeNumber(product.stock) === 0}
                  className="w-full bg-[#8B0000] hover:bg-[#8B0000]/90"
                  size="lg"
                >
                  <Icons.Plus className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                
                <Button variant="outline" className="w-full" size="lg">
                  Comprar Agora
                </Button>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={`tag-${index}`} variant="secondary">
                      {safeString(tag)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descrição e Informações do Negócio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Descrição */}
          <div className="lg:col-span-2">
            <Card className="border border-[#8B0000]/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Descrição</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {safeString(product.description)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Informações do Negócio */}
          {business && (
            <div>
              <Card className="border border-[#8B0000]/20">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Vendido por</h3>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      {business.logoUrl ? (
                        <img
                          src={business.logoUrl}
                          alt={safeString(business.name)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icons.Building className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{safeString(business.name)}</h4>
                      <div className="flex items-center space-x-1">
                        {renderStars(business.rating, 'w-4 h-4')}
                        <span className="text-sm text-gray-600">
                          ({safeNumber(business.reviewCount)})
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {safeString(business.description)}
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => navigate(`/marketplace/business/${business.id}`)}
                    className="w-full border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white"
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