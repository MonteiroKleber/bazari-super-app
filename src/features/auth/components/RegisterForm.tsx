
// BEGIN ETAPA3-AUTH
import { FC, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAuthForm } from '../hooks/useAuthForm'
import { useWalletGeneration } from '../hooks/useWalletGeneration'

interface RegisterFormProps {
  onComplete: () => void
  onBackToLogin: () => void
}

export const RegisterForm: FC<RegisterFormProps> = ({
  onComplete,
  onBackToLogin
}) => {
  const { register, isLoading, error } = useAuth()
  const { formState, validateField, setFieldError, setFieldTouched } = useAuthForm()
  const { generateNewSeedPhrase } = useWalletGeneration()

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    accountName: 'Minha Conta',
    agreedToTerms: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFieldTouched(field, true)
    if (typeof value === 'string') {
      const error = validateField(field, value, formData)
      setFieldError(field, error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const passwordError = validateField('password', formData.password)
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword, formData)
    if (passwordError || confirmPasswordError) {
      setFieldError('password', passwordError)
      setFieldError('confirmPassword', confirmPasswordError)
      return
    }
    if (!formData.agreedToTerms) {
      setFieldError('terms', 'Você deve aceitar os termos')
      return
    }
    try {
      const seedPhrase = await generateNewSeedPhrase()
      await register({ password: formData.password, confirmPassword: formData.confirmPassword }, seedPhrase)
      onComplete()
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nome da conta</label>
        <input
          type="text"
          value={formData.accountName}
          onChange={(e) => handleInputChange('accountName', e.target.value)}
          className="w-full input-bazari"
          placeholder="Digite o nome da conta"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="w-full input-bazari"
          placeholder="Crie uma senha forte"
          required
        />
        {formState.errors.password && (
          <p className="mt-1 text-sm text-error-600">{formState.errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="w-full input-bazari"
          placeholder="Confirme sua senha"
          required
        />
        {formState.errors.confirmPassword && (
          <p className="mt-1 text-sm text-error-600">{formState.errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={formData.agreedToTerms}
          onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          Eu li e aceito os termos
        </label>
      </div>
      {formState.errors.terms && (
        <p className="text-sm text-error-600">{formState.errors.terms}</p>
      )}

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-3">
          <p className="text-error-700 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !formState.isValid || !formData.agreedToTerms}
        className="w-full btn-primary disabled:opacity-50"
      >
        {isLoading ? 'Criando conta...' : 'Criar Conta'}
      </button>

      <div className="text-center">
        <button type="button" onClick={onBackToLogin} className="text-primary-600 hover:text-primary-500 text-sm">
          Já tenho conta
        </button>
      </div>
    </form>
  )
}
// END ETAPA3-AUTH

