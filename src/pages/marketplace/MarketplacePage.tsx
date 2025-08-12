import { FC, useState, useEffect } from 'react'
import { useMarketplace } from '@features/marketplace/hooks/useMarketplace'
import { CategorySelector } from '@features/marketplace/components/CategorySelector'
import { ProductCard } from '@features/marketplace/components/ProductCard'
import { BusinessCard } from '@features/marketplace/components/BusinessCard'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Select } from '@shared/ui/Select'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/Tabs'


export const MarketplacePage: FC = () => {
  const {
    products,
    businesses,
    searchProducts,
    searchBusinesses,
    loadMoreProducts,
    loadMoreBusinesses,
    addToCart,
    hasMoreProducts,
    hasMoreBusinesses,
    isLoading,
    error,
    clearError
  } = useMarketplace()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  // Executar busca inicial
  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = () => {
    clearError()
    
    const filters = {
      category: selectedCategory || undefined,
      priceMin: priceRange.min ? parseFloat(priceRange.min) : undefined,
      priceMax: priceRange.max ? parseFloat(priceRange.max) : undefined
    }

    if (activeTab === 'products') {
      searchProducts(searchQuery, filters)
    } else {
      searchBusinesses(searchQuery, filters)
    }
  }

  const handleLoadMore = () => {
    const filters = {
      category: selectedCategory || undefined,
      priceMin: priceRange.min ? parseFloat(priceRange.min) : undefined,
      priceMax: priceRange.max ? parseFloat(priceRange.max) : undefined
    }

    if (activeTab === 'products') {
      loadMoreProducts(searchQuery, filters)
    } else {
      loadMoreBusinesses(searchQuery, filters)
    }
  }

  const handleAddToCart = async (productId: string) => {
    const success = await addToCart(productId)
    if (success) {
      // TODO: Show toast notification
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🛒 Marketplace Bazari
          </h1>
          <p className="text-gray-600">
            Descubra produtos e serviços incríveis na economia descentralizada
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="space-y-4">
            {/* Barra de Busca */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar produtos, serviços ou negócios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  icon={<Icons.Search className="w-5 h-5" />}
                />
              </div>
              
              <Button onClick={handleSearch} loading={isLoading}>
                Buscar
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Icons.Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Filtros Expandidos */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <CategorySelector
                    selectedCategory={selectedCategory || undefined}
                    onCategoryChange={setSelectedCategory}
                    placeholder="Todas as categorias"
                  />
                </div>

                {/* Faixa de Preço */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Mínimo (BZR)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Máximo (BZR)
                    </label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="relevance">Relevância</option>
                      <option value="price_asc">Menor Preço</option>
                      <option value="price_desc">Maior Preço</option>
                      <option value="rating">Melhor Avaliado</option>
                      <option value="newest">Mais Recente</option>
                    </Select>
                  </div>
                </div>

                {/* Ações dos Filtros */}
                <div className="flex space-x-3">
                  <Button onClick={handleSearch} size="sm">
                    Aplicar Filtros
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null)
                      setPriceRange({ min: '', max: '' })
                      setSearchQuery('')
                      setSortBy('relevance')
                    }}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="products">
              <Icons.Package className="w-4 h-4 mr-2" />
              Produtos ({products.length})
            </TabsTrigger>
            <TabsTrigger value="businesses">
              <Icons.Building className="w-4 h-4 mr-2" />
              Negócios ({businesses.length})
            </TabsTrigger>
          </TabsList>

          {/* Produtos */}
          <TabsContent value="products">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {products.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <Icons.Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {hasMoreProducts && (
                  <div className="text-center">
                    <Button
                      onClick={handleLoadMore}
                      loading={isLoading}
                      variant="secondary"
                    >
                      Carregar Mais Produtos
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Negócios */}
          <TabsContent value="businesses">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {businesses.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <Icons.Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum negócio encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {businesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                    />
                  ))}
                </div>

                {hasMoreBusinesses && (
                  <div className="text-center">
                    <Button
                      onClick={handleLoadMore}
                      loading={isLoading}
                      variant="secondary"
                    >
                      Carregar Mais Negócios
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        )}
      </div>
    </div>
  )
}
