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