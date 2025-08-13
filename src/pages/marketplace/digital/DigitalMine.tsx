// 📱 src/pages/marketplace/digital/DigitalMine.tsx
import { FC, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@shared/hooks/useTranslation'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/Tabs'
import { Icons } from '@shared/ui/Icons'
import { DecryptGate } from '@features/marketplace/components/digital/DecryptGate'
import { ResaleCta } from '@features/marketplace/components/digital/ResaleCta'

interface DigitalPurchase {
  productId: string
  product: {
    id: string
    name: string
    description: string
    price: number
    currency: string
    image: string
    category: string
    license: string
    onchain: {
      tokenId: string
      chain: string
    }
  }
  purchasedAt: string
  accessGranted: boolean
}

export const DigitalMine: FC = () => {
  const { t } = useTranslation()
  const [purchases, setPurchases] = useState<DigitalPurchase[]>([])
  const [activeTab, setActiveTab] = useState('todos')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPurchases()
  }, [])

  const loadPurchases = () => {
    // Carregar de localStorage (mock)
    const storedPurchases = JSON.parse(localStorage.getItem('digitalPurchases') || '[]')
    
    // Mock de produtos comprados
    const mockPurchases: DigitalPurchase[] = [
      {
        productId: 'digital_1',
        product: {
          id: 'digital_1',
          name: 'Curso Completo de Web3 Development',
          description: 'Aprenda desenvolvimento Web3 do zero ao avançado',
          price: 299,
          currency: 'BZR',
          image: 'https://picsum.photos/400/300?random=digital1',
          category: 'cursos-tokenizados',
          license: 'lifetime',
          onchain: {
            tokenId: 'digit_curso_001',
            chain: 'BazariChain'
          }
        },
        purchasedAt: '2024-08-10T14:30:00Z',
        accessGranted: true
      },
      {
        productId: 'digital_2',
        product: {
          id: 'digital_2',
          name: 'E-book: DeFi Strategies 2024',
          description: 'Guia completo de estratégias DeFi',
          price: 99,
          currency: 'BZR',
          image: 'https://picsum.photos/400/300?random=digital2',
          category: 'ebooks-digitais',
          license: 'days90',
          onchain: {
            tokenId: 'digit_ebook_002',
            chain: 'BazariChain'
          }
        },
        purchasedAt: '2024-08-08T09:15:00Z',
        accessGranted: true
      },
      {
        productId: 'digital_3',
        product: {
          id: 'digital_3',
          name: 'NFT Art: Cosmic Collection #47',
          description: 'Arte digital exclusiva da coleção Cosmic',
          price: 0.8,
          currency: 'BZR',
          image: 'https://picsum.photos/400/300?random=digital3',
          category: 'colecionaveis-digitais',
          license: 'lifetime',
          onchain: {
            tokenId: 'digit_nft_003',
            chain: 'BazariChain'
          }
        },
        purchasedAt: '2024-08-05T16:45:00Z',
        accessGranted: false
      }
    ]

    setPurchases(mockPurchases)
    setIsLoading(false)
  }

  const handleAccessGrant = (productId: string) => {
    setPurchases(prev => prev.map(p => 
      p.productId === productId 
        ? { ...p, accessGranted: true }
        : p
    ))
  }

  const filteredPurchases = purchases.filter(purchase => {
    switch (activeTab) {
      case 'cursos':
        return purchase.product.category === 'cursos-tokenizados'
      case 'ebooks':
        return purchase.product.category === 'ebooks-digitais'
      case 'nfts':
        return purchase.product.category === 'colecionaveis-digitais'
      default:
        return true
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas compras...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('marketplaceDigital', 'mine.title')}
          </h1>
          <p className="text-gray-600">
            Gerencie e acesse seus produtos digitais adquiridos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Icons.Package className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{purchases.length}</h3>
            <p className="text-gray-600">Total de Compras</p>
          </Card>
          <Card className="p-6 text-center">
            <Icons.Unlock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">
              {purchases.filter(p => p.accessGranted).length}
            </h3>
            <p className="text-gray-600">Com Acesso</p>
          </Card>
          <Card className="p-6 text-center">
            <Icons.TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">
              {purchases.reduce((acc, p) => acc + p.product.price, 0).toFixed(1)}
            </h3>
            <p className="text-gray-600">BZR Investidos</p>
          </Card>
          <Card className="p-6 text-center">
            <Icons.Zap className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">
              {purchases.filter(p => p.product.category === 'colecionaveis-digitais').length}
            </h3>
            <p className="text-gray-600">NFTs Coletados</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="todos">
              <Icons.Package className="w-4 h-4 mr-2" />
              Todos ({purchases.length})
            </TabsTrigger>
            <TabsTrigger value="cursos">
              <Icons.GraduationCap className="w-4 h-4 mr-2" />
              Cursos ({purchases.filter(p => p.product.category === 'cursos-tokenizados').length})
            </TabsTrigger>
            <TabsTrigger value="ebooks">
              <Icons.Book className="w-4 h-4 mr-2" />
              E-books ({purchases.filter(p => p.product.category === 'ebooks-digitais').length})
            </TabsTrigger>
            <TabsTrigger value="nfts">
              <Icons.Image className="w-4 h-4 mr-2" />
              NFTs ({purchases.filter(p => p.product.category === 'colecionaveis-digitais').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredPurchases.length === 0 ? (
              <div className="text-center py-12">
                <Icons.Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma compra encontrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Explore o marketplace digital e adquira seus primeiros ativos
                </p>
                <Link to="/marketplace/digitais">
                  <Button>
                    <Icons.Search className="w-4 h-4 mr-2" />
                    Explorar Digitais
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPurchases.map((purchase) => (
                  <Card key={purchase.productId} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Imagem */}
                      <div className="flex-shrink-0">
                        <img 
                          src={purchase.product.image}
                          alt={purchase.product.name}
                          className="w-full md:w-32 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Informações */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {purchase.product.name}
                          </h3>
                          <div className="flex items-center ml-4">
                            <Badge 
                              variant={purchase.accessGranted ? "default" : "secondary"}
                              className={purchase.accessGranted ? "bg-green-100 text-green-800" : ""}
                            >
                              {purchase.accessGranted ? (
                                <>
                                  <Icons.Unlock className="w-3 h-3 mr-1" />
                                  Acesso Liberado
                                </>
                              ) : (
                                <>
                                  <Icons.Lock className="w-3 h-3 mr-1" />
                                  Aguardando Acesso
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {purchase.product.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span>Comprado em {new Date(purchase.purchasedAt).toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span>{purchase.product.price} {purchase.product.currency}</span>
                          <span>•</span>
                          <span>Token ID: {purchase.product.onchain.tokenId}</span>
                        </div>

                        {/* Ações */}
                        <div className="flex flex-wrap gap-3">
                          {purchase.accessGranted ? (
                            <>
                              <Link to={`/marketplace/digitais/produto/${purchase.productId}`}>
                                <Button size="sm">
                                  <Icons.Play className="w-4 h-4 mr-2" />
                                  Acessar Conteúdo
                                </Button>
                              </Link>
                              <ResaleCta 
                                tokenId={purchase.product.onchain.tokenId} 
                                suggestedPrice={purchase.product.price * 1.1} 
                              />
                            </>
                          ) : (
                            <DecryptGate onAccess={() => handleAccessGrant(purchase.productId)}>
                              <Button size="sm" disabled>
                                <Icons.Lock className="w-4 h-4 mr-2" />
                                Aguardando Liberação
                              </Button>
                            </DecryptGate>
                          )}
                          
                          <Button variant="outline" size="sm">
                            <Icons.ExternalLink className="w-4 h-4 mr-2" />
                            Ver na Blockchain
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Icons.Download className="w-4 h-4 mr-2" />
                            Baixar Certificado
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/index.tsx
import { FC, useState } from 'react'
import { useTranslation } from '@shared/hooks/useTranslation'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Icons } from '@shared/ui/Icons'
import { StepType } from './StepType'
import { StepUploads } from './StepUploads'
import { StepLicense } from './StepLicense'
import { StepSupply } from './StepSupply'
import { StepRoyalties } from './StepRoyalties'
import { StepPricing } from './StepPricing'
import { StepReview } from './StepReview'
import { StepPublish } from './StepPublish'

interface DigitalProductData {
  type: string
  title: string
  description: string
  category: string
  files: File[]
  coverImage?: File
  license: 'lifetime' | 'days30' | 'days90'
  supply: number
  isUnlimited: boolean
  royaltiesPct: number
  price: number
  currency: 'BZR' | 'USD'
  tags: string[]
}

const steps = [
  { id: 'type', name: 'Tipo', icon: Icons.Package },
  { id: 'uploads', name: 'Uploads', icon: Icons.Upload },
  { id: 'license', name: 'Licença', icon: Icons.Shield },
  { id: 'supply', name: 'Supply', icon: Icons.Hash },
  { id: 'royalties', name: 'Royalties', icon: Icons.Percent },
  { id: 'pricing', name: 'Preço', icon: Icons.DollarSign },
  { id: 'review', name: 'Revisão', icon: Icons.Eye },
  { id: 'publish', name: 'Publicar', icon: Icons.Upload }
]

export const DigitalCreateWizard: FC = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<DigitalProductData>({
    type: '',
    title: '',
    description: '',
    category: '',
    files: [],
    license: 'lifetime',
    supply: 1,
    isUnlimited: false,
    royaltiesPct: 5,
    price: 0,
    currency: 'BZR',
    tags: []
  })

  const updateFormData = (data: Partial<DigitalProductData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'type':
        return <StepType data={formData} onUpdate={updateFormData} />
      case 'uploads':
        return <StepUploads data={formData} onUpdate={updateFormData} />
      case 'license':
        return <StepLicense data={formData} onUpdate={updateFormData} />
      case 'supply':
        return <StepSupply data={formData} onUpdate={updateFormData} />
      case 'royalties':
        return <StepRoyalties data={formData} onUpdate={updateFormData} />
      case 'pricing':
        return <StepPricing data={formData} onUpdate={updateFormData} />
      case 'review':
        return <StepReview data={formData} onUpdate={updateFormData} />
      case 'publish':
        return <StepPublish data={formData} onUpdate={updateFormData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('marketplaceDigital', 'create.title')}
          </h1>
          <p className="text-gray-600">
            Crie e tokenize seu produto digital em alguns passos
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <Icons.Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-16 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="text-center">
                <p className={`text-sm ${
                  index <= currentStep ? 'text-primary-600 font-medium' : 'text-gray-500'
                }`}>
                  {t('marketplaceDigital', 'create.steps', step.id) || step.name}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Step Content */}
        <Card className="p-8 mb-8">
          {renderStep()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button className="bg-green-600 hover:bg-green-700">
              <Icons.Check className="w-4 h-4 mr-2" />
              {t('marketplaceDigital', 'create.publishCta')}
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Próximo
              <Icons.ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}

export default DigitalCreateWizard

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/StepType.tsx
import { FC } from 'react'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface StepTypeProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepType: FC<StepTypeProps> = ({ data, onUpdate }) => {
  const productTypes = [
    {
      id: 'curso',
      name: 'Curso Online',
      description: 'Curso em vídeo com certificado NFT',
      icon: Icons.GraduationCap,
      category: 'cursos-tokenizados'
    },
    {
      id: 'ebook',
      name: 'E-book',
      description: 'Livro digital tokenizado',
      icon: Icons.Book,
      category: 'ebooks-digitais'
    },
    {
      id: 'software',
      name: 'Software',
      description: 'Aplicativo ou ferramenta digital',
      icon: Icons.Code,
      category: 'software'
    },
    {
      id: 'nft',
      name: 'NFT / Arte',
      description: 'Arte digital ou colecionável',
      icon: Icons.Image,
      category: 'colecionaveis-digitais'
    }
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Que tipo de produto digital você quer criar?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productTypes.map((type) => (
          <Card
            key={type.id}
            className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
              data.type === type.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUpdate({ 
              type: type.id,
              category: type.category 
            })}
          >
            <div className="text-center">
              <type.icon className={`w-12 h-12 mx-auto mb-4 ${
                data.type === type.id ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {type.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {type.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/StepUploads.tsx
import { FC, useRef } from 'react'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'
import { Icons } from '@shared/ui/Icons'

interface StepUploadsProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepUploads: FC<StepUploadsProps> = ({ data, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      onUpdate({ files: Array.from(files) })
    }
  }

  const handleCoverUpload = (files: FileList | null) => {
    if (files && files[0]) {
      onUpdate({ coverImage: files[0] })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Upload de arquivos e informações básicas
      </h2>

      {/* Informações Básicas */}
      <div className="space-y-4">
        <Input
          label="Título do Produto *"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Ex: Curso Completo de Web3 Development"
        />

        <Textarea
          label="Descrição *"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Descreva seu produto digital..."
          rows={4}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagem de Capa *
        </label>
        <div
          onClick={() => coverInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {data.coverImage ? (
            <div className="space-y-2">
              <Icons.Image className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-sm text-gray-600">{data.coverImage.name}</p>
              <p className="text-xs text-gray-500">Clique para alterar</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Icons.Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">Clique para selecionar uma imagem</p>
              <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
            </div>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleCoverUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Files Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Arquivos do Produto *
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {data.files.length > 0 ? (
            <div className="space-y-2">
              <Icons.FileText className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-sm text-gray-600">
                {data.files.length} arquivo(s) selecionado(s)
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                {data.files.slice(0, 3).map((file: File, index: number) => (
                  <div key={index}>{file.name}</div>
                ))}
                {data.files.length > 3 && (
                  <div>e mais {data.files.length - 3} arquivo(s)...</div>
                )}
              </div>
              <p className="text-xs text-gray-500">Clique para alterar</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Icons.Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">
                Clique para selecionar os arquivos do produto
              </p>
              <p className="text-xs text-gray-500">
                Vídeos, PDFs, arquivos de código, etc.
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  )
}

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/StepLicense.tsx
import { FC } from 'react'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface StepLicenseProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepLicense: FC<StepLicenseProps> = ({ data, onUpdate }) => {
  const licenses = [
    {
      id: 'lifetime',
      name: 'Acesso Vitalício',
      description: 'O comprador terá acesso permanente',
      icon: Icons.Infinity,
      recommended: true
    },
    {
      id: 'days90',
      name: '90 Dias',
      description: 'Acesso por 90 dias após a compra',
      icon: Icons.Calendar
    },
    {
      id: 'days30',
      name: '30 Dias',
      description: 'Acesso por 30 dias após a compra',
      icon: Icons.Clock
    }
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Tipo de licença para seu produto
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {licenses.map((license) => (
          <Card
            key={license.id}
            className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg relative ${
              data.license === license.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUpdate({ license: license.id })}
          >
            {license.recommended && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
            )}
            <div className="text-center">
              <license.icon className={`w-12 h-12 mx-auto mb-4 ${
                data.license === license.id ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {license.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {license.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/StepSupply.tsx
import { FC } from 'react'
import { Input } from '@shared/ui/Input'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface StepSupplyProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepSupply: FC<StepSupplyProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Quantidade disponível
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unlimited */}
        <Card
          className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
            data.isUnlimited
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onUpdate({ isUnlimited: true, supply: 0 })}
        >
          <div className="text-center">
            <Icons.Infinity className={`w-12 h-12 mx-auto mb-4 ${
              data.isUnlimited ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ilimitado
            </h3>
            <p className="text-gray-600 text-sm">
              Pode ser vendido quantas vezes quiser
            </p>
          </div>
        </Card>

        {/* Limited */}
        <Card
          className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
            !data.isUnlimited
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onUpdate({ isUnlimited: false })}
        >
          <div className="text-center">
            <Icons.Hash className={`w-12 h-12 mx-auto mb-4 ${
              !data.isUnlimited ? 'text-primary-600' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Limitado
            </h3>
            <p className="text-gray-600 text-sm">
              Edição limitada com escassez
            </p>
          </div>
        </Card>
      </div>

      {!data.isUnlimited && (
        <div className="max-w-md mx-auto">
          <Input
            type="number"
            label="Quantidade Disponível"
            value={data.supply}
            onChange={(e) => onUpdate({ supply: parseInt(e.target.value) || 1 })}
            placeholder="Ex: 100"
            min="1"
          />
          <p className="text-sm text-gray-600 mt-2">
            Cada unidade será um token único (NFT)
          </p>
        </div>
      )}
    </div>
  )
}

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/StepRoyalties.tsx
import { FC } from 'react'
import { Input } from '@shared/ui/Input'
import { Card } from '@shared/ui/Card'

interface StepRoyaltiesProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepRoyalties: FC<StepRoyaltiesProps> = ({ data, onUpdate }) => {
  const presetRoyalties = [0, 2.5, 5, 7.5, 10, 15]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Porcentagem de royalties nas revendas
      </h2>
      
      <p className="text-gray-600">
        Você receberá esta porcentagem cada vez que seu produto for revendido na DEX
      </p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {presetRoyalties.map((percentage) => (
          <Card
            key={percentage}
            className={`p-4 text-center cursor-pointer border-2 transition-all hover:shadow-lg ${
              data.royaltiesPct === percentage
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUpdate({ royaltiesPct: percentage })}
          >
            <p className={`text-2xl font-bold ${
              data.royaltiesPct === percentage ? 'text-primary-600' : 'text-gray-700'
            }`}>
              {percentage}%
            </p>
          </Card>
        ))}
      </div>

      <div className="max-w-md mx-auto">
        <Input
          type="number"
          label="Ou defina uma porcentagem personalizada"
          value={data.royaltiesPct}
          onChange={(e) => onUpdate({ royaltiesPct: parseFloat(e.target.value) || 0 })}
          placeholder="Ex: 8.5"
          min="0"
          max="25"
          step="0.1"
        />
        <p className="text-sm text-gray-600 mt-2">
          Máximo: 25% | Recomendado: 5-10%
        </p>
      </div>
    </div>
  )
}

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/StepPricing.tsx
import { FC } from 'react'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'

interface StepPricingProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepPricing: FC<StepPricingProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Defina o preço do seu produto
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Input
            type="number"
            label="Preço"
            value={data.price}
            onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Select
            label="Moeda"
            value={data.currency}
            onChange={(value) => onUpdate({ currency: value })}
          >
            <option value="BZR">BZR</option>
            <option value="USD">USD</option>
          </Select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Preço de venda:</span>
          <span className="font-medium">{data.price} {data.currency}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxa da plataforma (2.5%):</span>
          <span>-{(data.price * 0.025).toFixed(2)} {data.currency}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxa de gas (estimada):</span>
          <span>-0.01 {data.currency}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Você receberá:</span>
          <span>{(data.price * 0.975 - 0.01).toFixed(2)} {data.currency}</span>
        </div>
      </div>
    </div>
  )
}

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/StepReview.tsx
import { FC } from 'react'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

interface StepReviewProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepReview: FC<StepReviewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Revise as informações do seu produto
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Preview do Produto</h3>
          
          <div className="space-y-4">
            {data.coverImage && (
              <img 
                src={URL.createObjectURL(data.coverImage)}
                alt="Cover"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {data.title}
              </h4>
              <p className="text-gray-600 mt-2 line-clamp-3">
                {data.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>Tokenizado</Badge>
              {data.royaltiesPct > 0 && <Badge>Royalties {data.royaltiesPct}%</Badge>}
              <Badge>{data.license === 'lifetime' ? 'Vitalícia' : `${data.license.replace('days', '')} dias`}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {data.price} {data.currency}
              </span>
              <span className="text-sm text-gray-600">
                {data.isUnlimited ? 'Ilimitado' : `${data.supply} unidades`}
              </span>
            </div>
          </div>
        </Card>

        {/* Details */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Detalhes Técnicos</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">{data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium">{data.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arquivos:</span>
                <span className="font-medium">{data.files.length} arquivo(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Licença:</span>
                <span className="font-medium">
                  {data.license === 'lifetime' ? 'Vitalícia' : `${data.license.replace('days', '')} dias`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supply:</span>
                <span className="font-medium">
                  {data.isUnlimited ? 'Ilimitado' : `${data.supply} unidades`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Royalties:</span>
                <span className="font-medium">{data.royaltiesPct}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Resumo Financeiro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Preço de venda:</span>
                <span>{data.price} {data.currency}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa da plataforma:</span>
                <span>-{(data.price * 0.025).toFixed(2)} {data.currency}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de gas:</span>
                <span>~0.01 {data.currency}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Você receberá:</span>
                <span>{(data.price * 0.975 - 0.01).toFixed(2)} {data.currency}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// 📱 src/pages/marketplace/digital/DigitalCreateWizard/StepPublish.tsx
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface StepPublishProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepPublish: FC<StepPublishProps> = ({ data }) => {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [txHash, setTxHash] = useState('')

  const handlePublish = async () => {
    setIsPublishing(true)
    
    // Simular processo de publicação
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock transaction hash
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
    setTxHash(mockTxHash)
    setIsPublished(true)
    setIsPublishing(false)
  }

  const handleViewProduct = () => {
    // Mock product ID
    const productId = 'digital_' + Date.now()
    navigate(`/marketplace/digitais/produto/${productId}`)
  }

  if (isPublished) {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Icons.Check className="w-12 h-12 text-green-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Produto Publicado com Sucesso! 🎉
          </h2>
          <p className="text-gray-600">
            Seu produto digital foi tokenizado e está disponível no marketplace
          </p>
        </div>

        <Card className="p-6 bg-gray-50">
          <h3 className="font-semibold mb-4">Detalhes da Transação</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Token ID:</span>
              <span className="font-mono">digital_{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction Hash:</span>
              <span className="font-mono text-xs">{txHash}</span>
            </div>
            <div className="flex justify-between">
              <span>Blockchain:</span>
              <span>BazariChain</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleViewProduct}>
            <Icons.Eye className="w-4 h-4 mr-2" />
            Ver Produto
          </Button>
          <Button variant="outline" onClick={() => navigate('/marketplace/digitais')}>
            <Icons.ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Marketplace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Tudo pronto para publicar!
        </h2>
        <p className="text-gray-600 mb-8">
          Clique em "Publicar e Assinar" para tokenizar seu produto e disponibilizá-lo no marketplace
        </p>
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          ⚡ O que acontecerá agora:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Seus arquivos serão enviados para o IPFS</li>
          <li>• Um token será criado na BazariChain</li>
          <li>• Seu produto ficará disponível no marketplace</li>
          <li>• Você poderá acompanhar as vendas e royalties</li>
        </ul>
      </Card>

      <Button
        onClick={handlePublish}
        loading={isPublishing}
        size="lg"
        className="bg-green-600 hover:bg-green-700"
        disabled={isPublishing}
      >
        {isPublishing ? (
          <>
            <Icons.Loader className="w-5 h-5 mr-2 animate-spin" />
            Publicando...
          </>
        ) : (
          <>
            <Icons.Upload className="w-5 h-5 mr-2" />
            Publicar e Assinar (mock)
          </>
        )}
      </Button>

      {isPublishing && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Publicando seu produto digital...
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '66%' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}