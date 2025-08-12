import { FC, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBusiness } from '@features/marketplace/hooks/useBusiness'
import { useMarketplace } from '@features/marketplace/hooks/useMarketplace'
import { ProductCard } from '@features/marketplace/components/ProductCard'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Card } from '@shared/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/Tabs'
import { Icons } from '@shared/ui/Icons'

export const BusinessDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { business, businessProducts, isLoading, loadBusiness } = useBusiness()
  const { addToCart } = useMarketplace()
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (id) {
      loadBusiness(id)
    }
  }, [id, loadBusiness])

  const handleAddToCart = async (productId: string) => {
    const success = await addToCart(productId)
    if (success) {
      // TODO: Show success notification
    }
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // TODO: Implement follow logic
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando negócio...</p>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icons.Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Negócio não encontrado</h1>
          <p className="text-gray-600 mb-4">O negócio que você procura não existe ou foi removido.</p>
          <Button onClick={() => navigate('/marketplace')}>
            Voltar ao Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const getVerificationBadge = () => {
    switch (business.verificationLevel) {
      case 'premium':
        return <Badge variant="primary">Premium</Badge>
      case 'verified':
        return <Badge variant="success">Verificado</Badge>
      case 'basic':
        return <Badge variant="secondary">Básico</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary-500 to-secondary-500">
        {business.bannerUrl && (
          <img
            src={business.bannerUrl}
            alt={`Banner ${business.name}`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header do Negócio */}
        <div className="relative -mt-16 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {/* Logo */}
                <div className="w-24 h-24 bg-white rounded-lg border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                  {business.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt={`Logo ${business.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Icons.Building className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {business.name}
                        </h1>
                        {getVerificationBadge()}
                        {business.isTokenized && (
                          <Badge variant="primary">
                            <Icons.Star className="w-3 h-3 mr-1" />
                            NFT
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {business.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Icons.MapPin className="w-4 h-4" />
                          <span>{business.address.city}, {business.address.state}</span>
                        </div>
                        
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
                          <span>{business.rating.toFixed(1)} ({business.reviewCount} avaliações)</span>
                        </div>

                        <span>{business.followers} seguidores</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        onClick={handleFollow}
                      >
                        <Icons.Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                        {isFollowing ? 'Seguindo' : 'Seguir'}
                      </Button>
                      
                      <Button>
                        <Icons.MessageCircle className="w-4 h-4 mr-2" />
                        Contato
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Conteúdo */}
        <Tabs defaultValue="products" className="mb-8">
          <TabsList>
            <TabsTrigger value="products">
              <Icons.Package className="w-4 h-4 mr-2" />
              Produtos ({businessProducts.length})
            </TabsTrigger>
            <TabsTrigger value="about">
              <Icons.Info className="w-4 h-4 mr-2" />
              Sobre
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Icons.Star className="w-4 h-4 mr-2" />
              Avaliações
            </TabsTrigger>
          </TabsList>

          {/* Produtos */}
          <TabsContent value="products">
            {businessProducts.length === 0 ? (
              <div className="text-center py-12">
                <Icons.Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum produto cadastrado
                </h3>
                <p className="text-gray-600">
                  Este negócio ainda não cadastrou produtos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {businessProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    showBusiness={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sobre */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Informações</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Icons.MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-sm text-gray-600">
                          {business.address.street}<br />
                          {business.address.city}, {business.address.state}<br />
                          {business.address.zipCode}
                        </p>
                      </div>
                    </div>

                    {business.phone && (
                      <div className="flex items-center space-x-3">
                        <Icons.Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Telefone</p>
                          <p className="text-sm text-gray-600">{business.phone}</p>
                        </div>
                      </div>
                    )}

                    {business.email && (
                      <div className="flex items-center space-x-3">
                        <Icons.Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-gray-600">{business.email}</p>
                        </div>
                      </div>
                    )}

                    {business.website && (
                      <div className="flex items-center space-x-3">
                        <Icons.Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            {business.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Categoria</h3>
                  <Badge variant="secondary" className="mb-4">
                    {business.category.icon} {business.category.name}
                  </Badge>

                  {business.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {business.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Avaliações */}
          <TabsContent value="reviews">
            <div className="text-center py-12">
              <Icons.Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sistema de avaliações em desenvolvimento
              </h3>
              <p className="text-gray-600">
                Em breve você poderá ver e deixar avaliações para este negócio.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
