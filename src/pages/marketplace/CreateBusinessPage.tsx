import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBusiness } from '@features/marketplace/hooks/useBusiness'
import { CategorySelector } from '@features/marketplace/components/CategorySelector'
import { Business } from '@entities/business'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

export const CreateBusinessPage: FC = () => {
  const navigate = useNavigate()
  const { createBusiness, isLoading, error } = useBusiness()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    category: '',
    // Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    // Tags
    tags: '',
    // Social
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description,
        ownerAddress: '', // Will be set by useBusiness hook
        category: { id: formData.category, name: '', level: 1, children: [] }, // Will be properly resolved
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode
        },
        isTokenized: false,
        rating: 0,
        reviewCount: 0,
        totalSales: 0,
        verificationLevel: 'none',
        isActive: true,
        isVerified: false,
        isFeatured: false,
        followers: 0,
        socialLinks: {
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter,
          linkedin: formData.linkedin
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      const business = await createBusiness(businessData)
      if (business) {
        navigate(`/marketplace/business/${business.id}`)
      }
    } catch (err) {
      console.error('Erro ao criar negócio:', err)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.description && formData.category
      case 2:
        return formData.street && formData.city && formData.state && formData.zipCode
      case 3:
        return true // Optional fields
      case 4:
        return true // Review step
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🏪 Cadastrar Negócio
          </h1>
          <p className="text-gray-600">
            Cadastre seu negócio no marketplace e comece a vender
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? (
                    <Icons.Check className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Informações Básicas</span>
            <span>Endereço</span>
            <span>Contato & Redes</span>
            <span>Revisão</span>
          </div>
        </div>

        <Card>
          <div className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Informações Básicas</h2>
                
                <Input
                  label="Nome do Negócio *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Minha Loja Incrível"
                />

                <Textarea
                  label="Descrição *"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva seu negócio, produtos e serviços..."
                  rows={4}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <CategorySelector
                    selectedCategory={formData.category}
                    onCategoryChange={(category) => handleInputChange('category', category || '')}
                    showFullPath
                  />
                </div>

                <Input
                  label="Tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Ex: artesanal, local, orgânico (separadas por vírgula)"
                  helperText="Adicione palavras-chave que descrevem seu negócio"
                />
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Endereço</h2>
                
                <Input
                  label="Rua e Número *"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Ex: Rua das Flores, 123"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Cidade *"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Ex: São Paulo"
                  />
                  
                  <Input
                    label="Estado *"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Ex: SP"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="CEP *"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="Ex: 01234-567"
                  />
                  
                  <Input
                    label="País"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled
                  />
                </div>
              </div>
            )}

            {/* Step 3: Contact & Social */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Contato & Redes Sociais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contato@meunegocio.com"
                  />
                  
                  <Input
                    label="Telefone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <Input
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://meunegocio.com"
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Redes Sociais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Instagram"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="@meunegocio"
                    />
                    
                    <Input
                      label="Facebook"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      placeholder="facebook.com/meunegocio"
                    />
                    
                    <Input
                      label="Twitter"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      placeholder="@meunegocio"
                    />
                    
                    <Input
                      label="LinkedIn"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/company/meunegocio"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Revisão</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Nome</h3>
                    <p className="text-gray-600">{formData.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Descrição</h3>
                    <p className="text-gray-600">{formData.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Endereço</h3>
                    <p className="text-gray-600">
                      {formData.street}<br />
                      {formData.city}, {formData.state} - {formData.zipCode}
                    </p>
                  </div>
                  
                  {formData.tags && (
                    <div>
                      <h3 className="font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="secondary"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                Voltar
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!isStepValid(currentStep)}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={isLoading}
                  disabled={!isStepValid(currentStep)}
                >
                  Criar Negócio
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
