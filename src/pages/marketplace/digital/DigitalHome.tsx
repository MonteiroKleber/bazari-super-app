// src/pages/marketplace/digital/DigitalHome.tsx
import { FC, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@shared/hooks/useTranslation'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'
import { ProductCard } from '@features/marketplace/components/ProductCard'
import { useMarketplace } from '@features/marketplace/hooks/useMarketplace'

type Category = { id: string; name: string; count: number; icon: string }

const TOP_CATEGORIES: Category[] = [
  { id: 'cursos-tokenizados', name: 'Cursos', count: 24, icon: '🎓' },
  { id: 'ebooks-digitais', name: 'E-books', count: 18, icon: '📚' },
  { id: 'software', name: 'Software', count: 12, icon: '💻' },
  { id: 'colecionaveis-digitais', name: 'NFTs', count: 45, icon: '🎨' }
]

export const DigitalHome: FC = () => {
  const { t } = useTranslation()
  const { products, searchProducts } = useMarketplace()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await searchProducts('', { isDigital: true })
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [searchProducts])

  const { featuredDigitals, recentDigitals } = useMemo(() => {
    const digitals = (products || []).filter(p => (p as any).isDigital)
    return {
      featuredDigitals: digitals.filter(p => (p as any).isFeatured).slice(0, 4),
      recentDigitals: digitals.slice(0, 6)
    }
  }, [products])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                {t('marketplace.digital.title', 'Marketplace de Produtos Digitais')}
              </h1>
              <p className="mt-4 text-white/90 text-lg">
                {t('marketplace.digital.subtitle', 'Compre, venda e revenda ativos digitais com prova on-chain.')}
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/marketplace/digitais/lista">
                  <Button size="lg" className="shadow-lg shadow-black/20">
                    {t('common.explore', 'Explorar')}
                    <Icons.ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/marketplace/digitais/criar">
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur">
                    {t('digital.create', 'Criar Digital')}
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="p-6 md:p-8 bg-white/10 backdrop-blur border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm opacity-80">Digitais</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">89</div>
                  <div className="text-sm opacity-80">Criadores</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">2.4k</div>
                  <div className="text-sm opacity-80">Compras</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Categorias */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('digital.categories', 'Categorias em alta')}</h2>
            <Link to="/marketplace/digitais/lista">
              <Button variant="ghost" size="sm">
                {t('common.viewAll', 'Ver todas')}
                <Icons.ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TOP_CATEGORIES.map((category) => (
              <Link key={category.id} to={`/marketplace/digitais/lista?category=${category.id}`}>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} produtos</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Destaques */}
        {featuredDigitals.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('digital.featured', 'Destaques')}</h2>
              <Link to="/marketplace/digitais/lista?featured=true">
                <Button variant="outline" size="sm">
                  {t('common.viewAll', 'Ver todos')}
                  <Icons.ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDigitals.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => {}}
                  showDigitalBadges
                />
              ))}
            </div>
          </section>
        )}

        {/* Recentes */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('digital.recent', 'Recentes')}</h2>
            <Link to="/marketplace/digitais/lista">
              <Button variant="ghost" size="sm">
                {t('common.explore', 'Explorar')}
                <Icons.ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(loading ? Array.from({ length: 6 }) : recentDigitals).map((item: any, idx: number) => (
              <div key={item?.id ?? idx} className="min-h-[120px]">
                {item ? (
                  <ProductCard product={item} onAddToCart={() => {}} showDigitalBadges />
                ) : (
                  <Card className="animate-pulse h-full" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default DigitalHome
