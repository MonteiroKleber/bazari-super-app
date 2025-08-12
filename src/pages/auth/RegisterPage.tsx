import { FC, useState, startTransition } from 'react' // ✅ ADICIONAR startTransition
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '@features/auth/components/RegisterForm'
import { SeedPhraseConfirmation } from '@features/auth/components/SeedPhraseConfirmation'
import { AuthLayout } from '@features/auth/components/AuthLayout'
import { SeedPhraseDisplay } from '@features/auth/components/SeedPhraseDisplay'
import { RegistrationSuccess } from '@features/auth/components/RegistrationSuccess'

type RegisterStep = 'form' | 'seedPhrase' | 'confirmation' | 'success'

export const RegisterPage: FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<RegisterStep>('form')

  const handleBackToLogin = () => {
    // ✅ ENVOLVER com startTransition
    startTransition(() => {
      navigate('/auth/login')
    })
  }

  const handleSuccess = () => {
    // ✅ ENVOLVER com startTransition
    startTransition(() => {
      navigate('/profile')
    })
  }

  return (
    <AuthLayout
      title={
        currentStep === 'form' ? 'Criar Conta' :
        currentStep === 'seedPhrase' ? 'Frase de Recuperação' :
        currentStep === 'confirmation' ? 'Confirmar Frase de Recuperação' :
        'Conta Criada'
      }
      subtitle={
        currentStep === 'form' ? 'Crie sua conta Web3 segura' :
        currentStep === 'seedPhrase' ? 'Guarde sua frase de recuperação' :
        currentStep === 'confirmation' ? 'Confirme algumas palavras para prosseguir' :
        'Tudo certo! Redirecionando...'
      }
      showBackButton={currentStep !== 'form'}
      onBack={currentStep === 'confirmation' ? 
        () => setCurrentStep('seedPhrase') : 
        currentStep === 'seedPhrase' ? 
        () => setCurrentStep('form') : 
        undefined
      }
    >
      {currentStep === 'form' && (
        <RegisterForm
          onNext={() => setCurrentStep('seedPhrase')}
          onBackToLogin={handleBackToLogin} // ✅ Com startTransition
        />
      )}
      
      {currentStep === 'seedPhrase' && (
        <SeedPhraseDisplay
          onNext={() => setCurrentStep('confirmation')}
          onBack={() => setCurrentStep('form')}
        />
      )}
      
      {currentStep === 'confirmation' && (
        <SeedPhraseConfirmation
          onSuccess={() => setCurrentStep('success')}
          onBack={() => setCurrentStep('seedPhrase')}
        />
      )}
      
      {currentStep === 'success' && (
        <RegistrationSuccess onContinue={handleSuccess} /> // ✅ Com startTransition
      )}
    </AuthLayout>
  )
}