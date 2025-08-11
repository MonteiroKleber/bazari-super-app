
// BEGIN ETAPA3-AUTH
import { FC, useState } from 'react'
import { authService } from '../services/authService'
import { useAuthForm } from '../hooks/useAuthForm'

interface RecoveryFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export const RecoveryForm: FC<RecoveryFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { formState, validateField, setFieldError, setFieldTouched } = useAuthForm()
  const [seedPhrase, setSeedPhrase] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recoveredAccount, setRecoveredAccount] = useState<{ address: string; publicKey: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeedPhraseChange = (value: string) => {
    const cleanValue = value.replace(/\s+/g, ' ').trim()
    setSeedPhrase(cleanValue)
    setFieldTouched('seedPhrase', true)
    const err = validateField('seedPhrase', cleanValue)
    setFieldError('seedPhrase', err)
    setRecoveredAccount(null)
    setError(null)
  }

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault()
    const seedPhraseError = validateField('seedPhrase', seedPhrase)
    if (seedPhraseError) {
      setFieldError('seedPhrase', seedPhraseError)
      return
    }
    setIsLoading(true); setError(null)
    try {
      const account = await authService.recoverAccount(seedPhrase)
      setRecoveredAccount(account)
    } catch (err:any) {
      setError(err?.message || 'Erro na recuperação da conta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmRecovery = () => onSuccess()

  return (
    <div className="space-y-6">
      {!recoveredAccount ? (
        <form onSubmit={handleRecover} className="space-y-6">
          <div className="bg-info-50 border border-info-200 rounded-lg p-4 text-sm text-info-700">
            Esta função permite verificar se sua seed phrase é válida e qual endereço ela gera.
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frase de Recuperação</label>
            <textarea
              value={seedPhrase}
              onChange={(e) => handleSeedPhraseChange(e.target.value)}
              className="w-full input-bazari h-24 resize-none"
              placeholder="Digite sua seed phrase para encontrar sua conta"
              required
            />
            {formState.errors.seedPhrase && (
              <p className="mt-1 text-sm text-error-600">{formState.errors.seedPhrase}</p>
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
              {isLoading ? 'Recuperando...' : 'Recuperar Conta'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">Conta encontrada com sucesso!</div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</label>
              <p className="mt-1 text-sm font-mono text-gray-900 break-all">{recoveredAccount.address}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Chave Pública</label>
              <p className="mt-1 text-sm font-mono text-gray-900 break-all">{recoveredAccount.publicKey}</p>
            </div>
          </div>

          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 text-sm text-warning-700">
            Para acessar esta conta, vá para "Importar Conta" e use a mesma seed phrase com uma nova senha.
          </div>

          <div className="flex space-x-4">
            <button type="button" onClick={onCancel} className="flex-1 btn-secondary">Voltar ao Login</button>
            <button type="button" onClick={handleConfirmRecovery} className="flex-1 btn-primary">Prosseguir para Importação</button>
          </div>
        </div>
      )}
    </div>
  )
}
// END ETAPA3-AUTH

