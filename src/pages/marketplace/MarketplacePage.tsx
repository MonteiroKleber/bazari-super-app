import { FC, useState, useEffect, useTransition, Suspense } from 'react'
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

// 🎯 SUSPENSE LOADING FALLBACK LOCAL (apenas para Marketplace)
const MarketplaceLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando marketplace...</p>
    </div>
  </div>
)

// 🎯 COMPONENTE PRINCIPAL COM SUSPENSE BOUNDARY
const MarketplaceContent: FC = () => {
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

  // 🔧 CORREÇÃO PRINCIPAL: useTransition para atualizações que podem suspender
  const [isPending, startTransition] = useTransition()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  // Executar busca inicial de forma assíncrona
  useEffect(() => {
    // 🔧 CORREÇÃO: Envolver busca inicial com startTransition
    startTransition(() => {
      handleSearch()
    })
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

  // 🔧 CORREÇÃO: Handler de busca com startTransition
  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    // Não dispara busca automática para evitar suspense em cada keystroke
  }

  // 🔧 CORREÇÃO: Handler de enter com startTransition
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      startTransition(() => {
        handleSearch()
      })
    }
  }

  // 🔧 CORREÇÃO: Handler de mudança de categoria com startTransition
  const handleCategoryChange = (category: string | null) => {
    startTransition(() => {
      setSelectedCategory(category)
      // Auto-busca após mudança de categoria
      setTimeout(() => handleSearch(), 0)
    })
  }

  // 🔧 CORREÇÃO: Handler de mudança de tab com startTransition
  const handleTabChange = (tab: string) => {
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  // 🔧 CORREÇÃO: Handler de filtros com startTransition
  const handleFiltersApply = () => {
    startTransition(() => {
      handleSearch()
    })
  }

  // 🔧 CORREÇÃO: Handler de limpeza de filtros com startTransition
  const handleFiltersClear = () => {
    startTransition(() => {
      setSelectedCategory(null)
      setPriceRange({ min: '', max: '' })
      setSearchQuery('')
      setSortBy('relevance')
      // Auto-busca após limpar filtros
      setTimeout(() => handleSearch(), 0)
    })
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
          {/* 🔧 INDICADOR DE PENDING STATE */}
          {isPending && (
            <div className="mt-2">
              <Badge variant="secondary">Atualizando...</Badge>
            </div>
          )}
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
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  icon={<Icons.Search className="w-5 h-5" />}
                />
              </div>
              
              <Button 
                onClick={() => startTransition(() => handleSearch())} 
                loading={isLoading || isPending}
              >
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
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  />
                </div>

                {/* Faixa de Preço */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Mínimo
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
                      Preço Máximo
                    </label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Ordenação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <Select
                    value={sortBy}
                    onChange={(value) => setSortBy(value)}
                  >
                    <option value="relevance">Relevância</option>
                    <option value="price_asc">Menor Preço</option>
                    <option value="price_desc">Maior Preço</option>
                    <option value="rating">Melhor Avaliado</option>
                    <option value="newest">Mais Recente</option>
                  </Select>
                </div>

                {/* Ações dos Filtros */}
                <div className="flex space-x-3">
                  <Button onClick={handleFiltersApply} size="sm" loading={isPending}>
                    Aplicar Filtros
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleFiltersClear}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
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

            {products.length === 0 && !isLoading && !isPending ? (
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

            {businesses.length === 0 && !isLoading && !isPending ? (
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

        {/* Loading overlay quando pending */}
        {isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <span className="text-gray-700">Processando...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 🎯 COMPONENTE PRINCIPAL COM SUSPENSE BOUNDARY
export const MarketplacePage: FC = () => {
  return (
    <Suspense fallback={<MarketplaceLoader />}>
      <MarketplaceContent />
    </Suspense>
  )
}