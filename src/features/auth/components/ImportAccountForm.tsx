
// BEGIN ETAPA3-AUTH
import { FC, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAuthForm } from '../hooks/useAuthForm'

interface ImportAccountFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export const ImportAccountForm: FC<ImportAccountFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { importAccount, isLoading, error } = useAuth()
  const { formState, validateField, setFieldError, setFieldTouched } = useAuthForm()

  const [formData, setFormData] = useState({
    seedPhrase: '',
    password: '',
    confirmPassword: '',
    accountName: 'Conta Importada'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFieldTouched(field, true)
    const err = validateField(field, value, formData)
    setFieldError(field, err)
  }

  const handleSeedPhraseChange = (value: string) => {
    const clean = value.replace(/\s+/g, ' ').trim()
    handleInputChange('seedPhrase', clean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const seedPhraseError = validateField('seedPhrase', formData.seedPhrase)
    const passwordError = validateField('password', formData.password)
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword, formData)
    if (seedPhraseError || passwordError || confirmPasswordError) {
      setFieldError('seedPhrase', seedPhraseError)
      setFieldError('password', passwordError)
      setFieldError('confirmPassword', confirmPasswordError)
      return
    }
    try {
      const success = await importAccount(formData.seedPhrase, formData.password, formData.accountName)
      if (success) onSuccess()
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Frase de Recuperação</label>
        <textarea
          value={formData.seedPhrase}
          onChange={(e) => handleSeedPhraseChange(e.target.value)}
          className="w-full input-bazari h-24 resize-none"
          placeholder="Digite 12 ou 24 palavras separadas por espaço"
          required
        />
        {formState.errors.seedPhrase && (
          <p className="mt-1 text-sm text-error-600">{formState.errors.seedPhrase}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="w-full input-bazari"
          placeholder="Crie uma senha para esta conta"
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

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-3">
          <p className="text-error-700 text-sm">{error}</p>
        </div>
      )}

      <div className="flex space-x-4">
        <button type="button" onClick={onCancel} className="flex-1 btn-secondary">Cancelar</button>
        <button type="submit" disabled={isLoading || !formState.isValid} className="flex-1 btn-primary disabled:opacity-50">
          {isLoading ? 'Importando conta...' : 'Importar Conta'}
        </button>
      </div>
    </form>
  )
}
// END ETAPA3-AUTH

