// src/pages/marketplace/BusinessDetailPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marketplaceService } from '@features/marketplace/services/marketplaceService'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Tabs, TabsList, TabsTrigger } from '@shared/ui/Tabs'
import { Icons } from '@shared/ui/Icons'

type Biz = {
  id: string
  name: string
  description?: string
  logo?: string
  banner?: string
  slug?: string
}

type ProductLike = {
  id: string
  name: string
  price?: number
  priceFormatted?: string
  compareAtPrice?: number
  salePrice?: number
  discountPercentage?: number
  businessId: string
  image?: string
  cover?: string
  thumbnail?: string
  images?: string[]
}

const PAGE_SIZE = 12

function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getProductImage(p: ProductLike): string | undefined {
  return p.image || p.thumbnail || p.cover || (p.images && p.images[0]) || undefined
}

function isOnSale(p: ProductLike): boolean {
  const price = p.salePrice ?? p.price ?? 0
  const compare = p.compareAtPrice ?? 0
  return Boolean(
    (p.salePrice != null && p.salePrice < (p.price ?? p.salePrice)) ||
      (compare > 0 && price > 0 && price < compare) ||
      (p.discountPercentage && p.discountPercentage > 0)
  )
}

async function resolveBusiness(idOrSlug: string): Promise<Biz | null> {
  if ((marketplaceService as any).initializeMockData) {
    try { await (marketplaceService as any).initializeMockData() } catch {}
  }

  // 1) tenta ID direto
  if (typeof (marketplaceService as any).getBusinessById === 'function') {
    try {
      const byId = await (marketplaceService as any).getBusinessById(idOrSlug)
      if (byId) return byId as Biz
    } catch {}
  }

  // 2) tenta por lista/busca
  try {
    const looksLikeSlug = idOrSlug.includes('-') && idOrSlug.length > 6
    const q = looksLikeSlug ? idOrSlug.replace(/-/g, ' ') : ''
    const res = await marketplaceService.searchBusinesses(q, {}, 1, 200)
    const items: Biz[] = (res as any)?.items ?? (res as any) ?? []

    const bySlugField = items.find(b => (b as any).slug === idOrSlug)
    if (bySlugField) return bySlugField

    const byNameSlug = items.find(b => slugify(b.name) === idOrSlug)
    if (byNameSlug) return byNameSlug

    const byIdInList = items.find(b => b.id === idOrSlug)
    if (byIdInList) return byIdInList

    return items[0] ?? null
  } catch {}

  return null
}

function formatPrice(p?: number) {
  if (p == null) return '—'
  try {
    return p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${p.toFixed(2)}`
  }
}

function BusinessDetailPage() {
  const { idOrSlug = '' } = useParams<{ idOrSlug: string }>()
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<Biz | null>(null)

  // estado de produtos / UI (padrão MarketplacePage: busca + "carregar mais")
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('') // o que está vigente na listagem
  const [activeTab, setActiveTab] = useState<'all' | 'promo'>('all')
  const [sort, setSort] = useState<'relevance' | 'price_asc' | 'price_desc'>('relevance')

  const [products, setProducts] = useState<ProductLike[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Carrega/resolve negócio
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const b = await resolveBusiness(idOrSlug)
        if (!mounted) return
        setBusiness(b)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [idOrSlug])

  // Reset da listagem quando negócio mudar OU quando o termo submetido mudar
  useEffect(() => {
    setProducts([])
    setPage(1)
    setHasMore(true)
  }, [business?.id, submittedQuery])

  // Função para buscar uma página (mesmo padrão da MarketplacePage)
  const fetchPage = async (nextPage: number) => {
    if (!business || loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      // filtro mínimo no serviço: businessId + query vigente
      const res = await marketplaceService.searchProducts(
        submittedQuery,
        { businessId: business.id },
        nextPage,
        PAGE_SIZE
      )

      // suporta retorno como objeto ou array
      const items: ProductLike[] = (res as any)?.items ?? (res as any) ?? []
      const srvHasMore: boolean | undefined = (res as any)?.hasMore

      // agrega mantendo únicos por id
      setProducts(prev => {
        const map = new Map(prev.map(p => [p.id, p]))
        for (const it of items) map.set(it.id, it)
        return Array.from(map.values())
      })

      setPage(nextPage)
      setHasMore(typeof srvHasMore === 'boolean' ? srvHasMore : items.length === PAGE_SIZE)
    } finally {
      setLoadingMore(false)
    }
  }

  // Carrega a primeira página quando necessário
  useEffect(() => {
    if (business?.id && products.length === 0 && hasMore && !loadingMore) {
      fetchPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business?.id, products.length, hasMore, loadingMore])

  // Ordenação e filtros client-side (como na MarketplacePage)
  const visibleProducts = useMemo(() => {
    let list = [...products]

    if (activeTab === 'promo') list = list.filter(isOnSale)

    if (sort === 'price_asc') {
      list.sort((a, b) => (a.salePrice ?? a.price ?? 0) - (b.salePrice ?? b.price ?? 0))
    } else if (sort === 'price_desc') {
      list.sort((a, b) => (b.salePrice ?? b.price ?? 0) - (a.salePrice ?? a.price ?? 0))
    }
    return list
  }, [products, activeTab, sort])

  const headerTitle = useMemo(() => {
    if (loading) return 'Carregando loja…'
    return business?.name ?? 'Negócio não encontrado'
  }, [loading, business])

  // Handlers
  const onSubmitSearch = () => {
    // aplica a busca e reseta listagem (efeito cuidará do reset)
    setSubmittedQuery(query.trim())
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-36 rounded-xl bg-gray-200" />
          <div className="h-6 w-2/3 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-44 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card className="p-8 text-center">
          <Icons.Store className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <h1 className="text-xl font-bold mb-2">Negócio não encontrado</h1>
          <p className="text-gray-600 mb-6">
            O negócio que você procura não existe ou foi removido.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/marketplace">
              <Button variant="outline">Voltar ao marketplace</Button>
            </Link>
            <Link to="/marketplace?tab=negocios">
              <Button>Ver outros negócios</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center">
                <Icons.Store className="w-7 h-7 text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{headerTitle}</h1>
              {business.description && (
                <p className="text-gray-600">{business.description}</p>
              )}
            </div>
            <div className="hidden md:flex gap-2">
              <Button variant="outline">
                <Icons.Heart className="w-4 h-4 mr-2" />
                Seguir
              </Button>
              <Button>
                <Icons.MessageSquare className="w-4 h-4 mr-2" />
                Contato
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLES (padrão da MarketplacePage: busca + tabs + sort) */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="bg-white border rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2 flex gap-2">
              <Input
                value={query}
                onChange={(e: any) => setQuery(e.target.value)}
                placeholder="Buscar produtos nesta loja…"
                onKeyDown={(e: any) => { if (e.key === 'Enter') onSubmitSearch() }}
              />
              <Button onClick={onSubmitSearch}>Buscar</Button>
            </div>
            <div className="flex gap-2 md:justify-end">
              <Select
                label="Ordenar"
                value={sort}
                onChange={(e: any) => setSort(e.target.value)}
              >
                <option value="relevance">Relevância</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="promo">Promoções</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* LISTA + LOAD MORE */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {visibleProducts.length === 0 ? (
          <Card className="p-8 text-center text-gray-600">
            Nenhum produto encontrado com os filtros atuais.
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.map((p) => {
                const img = getProductImage(p)
                const priceNow = p.salePrice ?? p.price
                const compare = p.compareAtPrice
                const onSale = isOnSale(p)

                return (
                  <Link key={p.id} to={`/marketplace/produto/${p.id}`}>
                    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="aspect-[4/3] bg-gray-100">
                        {img ? (
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Icons.Store className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="font-medium line-clamp-1">{p.name}</div>
                        <div className="mt-1 text-sm">
                          <span className="font-semibold">{formatPrice(priceNow)}</span>
                          {onSale && compare && (
                            <span className="ml-2 text-gray-500 line-through">
                              {formatPrice(compare)}
                            </span>
                          )}
                        </div>
                        <Button className="mt-3 w-full">Ver produto</Button>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {/* Botão "Carregar mais produtos" (amarelo, padrão MarketplacePage) */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => fetchPage(page + 1)}
                  disabled={loadingMore}
                  // amarelo no padrão Tailwind do projeto; ajusta se seu Button já aceitar "variant=warning"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 hover:border-yellow-500"
                >
                  {loadingMore ? 'Carregando…' : 'Carregar mais produtos'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Exportação dupla para compatibilidade com qualquer lazy()
export { BusinessDetailPage }
export default BusinessDetailPage
