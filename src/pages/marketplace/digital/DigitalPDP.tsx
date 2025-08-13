import { FC, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from '@shared/hooks/useTranslation'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/Tabs'
import { Icons } from '@shared/ui/Icons'
import { OnchainProofModal } from '@features/marketplace/components/digital/OnchainProofModal'
import { DecryptGate } from '@features/marketplace/components/digital/DecryptGate'
import { ResaleCta } from '@features/marketplace/components/digital/ResaleCta'
import { DigitalBadge } from '@features/marketplace/components/digital/DigitalBadge'
import { RoyaltyChip } from '@features/marketplace/components/digital/RoyaltyChip'
import { LicensePill } from '@features/marketplace/components/digital/LicensePill'

export const DigitalPDP: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  
  // Estados
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showProofModal, setShowProofModal] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)
  const [isAccessGranted, setIsAccessGranted] = useState(false)

  // Mock data
  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setProduct({
        id: id,
        name: 'Curso Completo de Web3 Development',
        description: 'Aprenda desenvolvimento Web3 do zero ao avançado com este curso tokenizado que inclui certificado NFT e acesso vitalício ao conteúdo.',
        price: 299,
        currency: 'BZR',
        images: [{
          url: 'https://picsum.photos/600/400?random=digital1',
          alt: 'Curso Web3',
          isMain: true
        }],
        category: 'cursos-tokenizados',
        isDigital: true,
        isTokenized: true,
        isNFT: true,
        royaltiesPct: 10,
        license: 'lifetime',
        onchain: {
          tokenId: 'digit_curso_001',
          chain: 'BazariChain',
          txHash: '0x1234567890abcdef1234567890abcdef12345678'
        },
        creator: {
          name: 'DevMaster Academy',
          isVerified: true,
          avatar: 'https://picsum.photos/100/100?random=creator1'
        },
        stats: {
          students: 1247,
          rating: 4.8,
          reviews: 156,
          lessons: 47,
          duration: '12h 30min'
        },
        features: [
          '47 aulas em vídeo HD',
          'Certificado NFT ao completar',
          'Código-fonte de todos os projetos',
          'Acesso vitalício ao conteúdo',
          'Suporte direto do instrutor',
          'Atualizações gratuitas'
        ]
      })
      setIsLoading(false)
    }, 1000)
  }, [id])

  const handlePurchase = () => {
    // Mock purchase
    setIsPurchased(true)
    // Simular adição às "Minhas Compras"
    const purchases = JSON.parse(localStorage.getItem('digitalPurchases') || '[]')
    purchases.push({
      productId: id,
      purchasedAt: new Date().toISOString(),
      accessGranted: false
    })
    localStorage.setItem('digitalPurchases', JSON.stringify(purchases))
  }

  const handleAccessGrant = () => {
    setIsAccessGranted(true)
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
          <Icons.AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Produto não encontrado</h2>
          <Link to="/marketplace/digitais">
            <Button variant="outline">Voltar aos Digitais</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/marketplace" className="hover:text-primary-600">Marketplace</Link>
            <Icons.ChevronRight className="w-4 h-4" />
            <Link to="/marketplace/digitais" className="hover:text-primary-600">Digitais</Link>
            <Icons.ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Imagem e Badges */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={product.images[0].url} 
                  alt={product.images[0].alt}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <DigitalBadge />
                  {product.royaltiesPct && <RoyaltyChip percentage={product.royaltiesPct} />}
                  {product.license && <LicensePill license={product.license} />}
                </div>
              </div>
            </Card>

            {/* Conteúdo em Tabs */}
            <Tabs defaultValue="sobre" className="w-full">
              <TabsList>
                <TabsTrigger value="sobre">
                  <Icons.Info className="w-4 h-4 mr-2" />
                  Sobre
                </TabsTrigger>
                <TabsTrigger value="conteudo">
                  <Icons.PlayCircle className="w-4 h-4 mr-2" />
                  Conteúdo
                </TabsTrigger>
                <TabsTrigger value="prova">
                  <Icons.Shield className="w-4 h-4 mr-2" />
                  Prova On-chain
                </TabsTrigger>
                <TabsTrigger value="avaliacoes">
                  <Icons.Star className="w-4 h-4 mr-2" />
                  Avaliações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sobre" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Descrição</h3>
                  <p className="text-gray-700 mb-6">{product.description}</p>
                  
                  <h4 className="font-semibold mb-3">O que você vai aprender:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Icons.Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabsContent>

              <TabsContent value="conteudo" className="mt-6">
                {isPurchased && isAccessGranted ? (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Conteúdo do Curso</h3>
                    <div className="space-y-4">
                      {/* Mock curriculum */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Módulo 1: Introdução ao Web3</h4>
                        <p className="text-sm text-gray-600 mb-3">6 aulas • 2h 15min</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm">1.1 O que é Web3?</span>
                            <Icons.PlayCircle className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm">1.2 Blockchain Basics</span>
                            <Icons.PlayCircle className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : isPurchased ? (
                  <DecryptGate onAccess={handleAccessGrant}>
                    <p>Conteúdo protegido do curso</p>
                  </DecryptGate>
                ) : (
                  <Card className="p-6 text-center">
                    <Icons.Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Conteúdo Protegido
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Compre este curso para acessar todo o conteúdo
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="prova" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Prova de Autenticidade On-chain</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Token ID</p>
                        <p className="text-sm text-gray-600 font-mono">{product.onchain.tokenId}</p>
                      </div>
                      <Icons.Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Blockchain</p>
                        <p className="text-sm text-gray-600">{product.onchain.chain}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Verificado</Badge>
                    </div>
                    <Button 
                      onClick={() => setShowProofModal(true)} 
                      variant="outline" 
                      className="w-full"
                    >
                      <Icons.ExternalLink className="w-4 h-4 mr-2" />
                      {t('marketplaceDigital', 'pdp.onchainProof')}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="avaliacoes" className="mt-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Avaliações</h3>
                    <div className="flex items-center">
                      <Icons.Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{product.stats.rating}</span>
                      <span className="ml-1 text-gray-600">({product.stats.reviews} avaliações)</span>
                    </div>
                  </div>
                  
                  {/* Mock reviews */}
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          J
                        </div>
                        <div>
                          <p className="font-medium">João Silva</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Icons.Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">há 2 dias</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Excelente curso! Muito didático e completo. O certificado NFT é um diferencial.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Compra */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              
              {/* Card de Compra */}
              <Card className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price} {product.currency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Acesso {product.license === 'lifetime' ? 'vitalício' : `por ${product.license.replace('days', '')} dias`}
                  </p>
                </div>

                {isPurchased ? (
                  <div className="space-y-3">
                    <Button className="w-full" disabled>
                      <Icons.Check className="w-4 h-4 mr-2" />
                      Já Adquirido
                    </Button>
                    <ResaleCta tokenId={product.onchain.tokenId} suggestedPrice={product.price * 1.1} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button onClick={handlePurchase} className="w-full" size="lg">
                      <Icons.ShoppingCart className="w-4 h-4 mr-2" />
                      {t('marketplaceDigital', 'pdp.buy')}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Icons.TrendingUp className="w-4 h-4 mr-2" />
                      {t('marketplaceDigital', 'pdp.viewDex')}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Informações do Criador */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Criador</h3>
                <div className="flex items-center mb-4">
                  <img 
                    src={product.creator.avatar} 
                    alt={product.creator.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{product.creator.name}</p>
                      {product.creator.isVerified && (
                        <Icons.CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Instrutor verificado</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{product.stats.students}</p>
                    <p className="text-sm text-gray-600">Estudantes</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{product.stats.rating}</p>
                    <p className="text-sm text-gray-600">Avaliação</p>
                  </div>
                </div>
              </Card>

              {/* Stats do Produto */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Detalhes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aulas</span>
                    <span className="font-medium">{product.stats.lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duração</span>
                    <span className="font-medium">{product.stats.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Royalties</span>
                    <span className="font-medium">{product.royaltiesPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Licença</span>
                    <span className="font-medium">
                      {product.license === 'lifetime' ? 'Vitalícia' : `${product.license.replace('days', '')} dias`}
                    </span>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>

        {/* Modal de Prova On-chain */}
        <OnchainProofModal
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
          onchain={product.onchain}
        />

      </div>
    </div>
  )
}