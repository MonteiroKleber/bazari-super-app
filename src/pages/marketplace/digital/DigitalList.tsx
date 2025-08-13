import { FC, useState, useEffect, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from '@shared/hooks/useTranslation'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Select } from '@shared/ui/Select'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'
import { ProductCard } from '@features/marketplace/components/ProductCard'
import { CategorySelector } from '@features/marketplace/components/CategorySelector'
import { useMarketplace } from '@features/marketplace/hooks/useMarketplace'

export const DigitalList: FC = () => {
  const { t } = useTranslation()
  const { products, searchProducts, isLoading } = useMarketplace()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null)
  const [licenseFilter, setLicenseFilter] = useState(searchParams.get('license') || 'all')
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('priceMin') || '',
    max: searchParams.get('priceMax') || ''
  })
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true')
  const [showFilters, setShowFilters] = useState(false)

  // Estados de resultados
  const [digitalProducts, setDigitalProducts] = useState([])
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = () => {
    startTransition(() => {
      const filters = {
        isDigital: true,
        category: selectedCategory || undefined,
        priceMin: priceRange.min ? parseFloat(priceRange.min) : undefined,
        priceMax: priceRange.max ? parseFloat(priceRange.max) : undefined,
        license: licenseFilter !== 'all' ? licenseFilter : undefined,
        isVerified: verifiedOnly || undefined
      }

      searchProducts(searchQuery, filters)
      
      // Atualizar URL params
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (selectedCategory) params.set('category', selectedCategory)
      if (licenseFilter !== 'all') params.set('license', licenseFilter)
      if (priceRange.min) params.set('priceMin', priceRange.min)
      if (priceRange.max) params.set('priceMax', priceRange.max)
      if (sortBy !== 'relevance') params.set('sort', sortBy)
      if (verifiedOnly) params.set('verified', 'true')
      
      setSearchParams(params)
    })
  }

  const handleClearFilters = () => {
    startTransition(() => {
      setSearchQuery('')
      setSelectedCategory(null)
      setLicenseFilter('all')
      setPriceRange({ min: '', max: '' })
      setSortBy('relevance')
      setVerifiedOnly(false)
      setSearchParams(new URLSearchParams())
    })
  }

  // Filtrar produtos digitais
  useEffect(() => {
    const digitals = products.filter(p => p.isDigital)
    setDigitalProducts(digitals)
    setTotalResults(digitals.length)
  }, [products])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Produtos Digitais
          </h1>
          <p className="text-gray-600">
            Descubra e adquira ativos digitais tokenizados
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar produtos digitais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} loading={isPending}>
                <Icons.Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Icons.Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Filtros Expandidos */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplaceDigital', 'filters.category')}
                  </label>
                  <CategorySelector
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    rootCategory="digitais"
                  />
                </div>

                {/* Licença */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplaceDigital', 'filters.license')}
                  </label>
                  <Select
                    value={licenseFilter}
                    onChange={setLicenseFilter}
                  >
                    <option value="all">Todas as licenças</option>
                    <option value="lifetime">Vitalícia</option>
                    <option value="days30">30 dias</option>
                    <option value="days90">90 dias</option>
                  </Select>
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('marketplaceDigital', 'filters.price')}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
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
                  <Select value={sortBy} onChange={setSortBy}>
                    <option value="relevance">Relevância</option>
                    <option value="price_asc">Menor Preço</option>
                    <option value="price_desc">Maior Preço</option>
                    <option value="newest">Mais Recente</option>
                    <option value="rating">Melhor Avaliado</option>
                  </Select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="mr-2"
                  />
                  {t('marketplaceDigital', 'filters.verified')}
                </label>
              </div>

              {/* Ações dos Filtros */}
              <div className="flex gap-3">
                <Button onClick={handleSearch} size="sm" loading={isPending}>
                  Aplicar Filtros
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                  Limpar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {totalResults} produtos digitais encontrados
            </p>
            <div className="flex gap-2">
              {selectedCategory && (
                <Badge variant="secondary">
                  Categoria: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        {digitalProducts.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <Icons.Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto digital encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou termos de busca
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {digitalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {}}
                showDigitalBadges={true}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {digitalProducts.length > 0 && digitalProducts.length < totalResults && (
          <div className="text-center mt-8">
            <Button onClick={handleSearch} loading={isLoading} variant="outline">
              Carregar Mais Produtos
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}