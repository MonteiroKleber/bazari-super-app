
// BEGIN ETAPA3-AUTH
import { FC, useState } from 'react'
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
      onBack={currentStep === 'confirmation' ? () => setCurrentStep('seedPhrase') : undefined}
    >
      {currentStep === 'form' && (
        <RegisterForm
          onComplete={() => setCurrentStep('seedPhrase')}
          onBackToLogin={() => navigate('/auth/login')}
        />
      )}
      {currentStep === 'seedPhrase' && (
        <SeedPhraseDisplay onContinue={() => setCurrentStep('confirmation')} />
      )}
      {currentStep === 'confirmation' && (
        <SeedPhraseConfirmation
          onConfirm={() => {
            setCurrentStep('success')
            setTimeout(() => navigate('/dashboard'), 2000)
          }}
          onBack={() => setCurrentStep('seedPhrase')}
        />
      )}
      {currentStep === 'success' && <RegistrationSuccess />}
    </AuthLayout>
  )
}
// END ETAPA3-AUTH

