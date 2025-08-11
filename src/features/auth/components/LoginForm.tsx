
// BEGIN ETAPA3-AUTH
import { FC, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAuthForm } from '../hooks/useAuthForm'
// OBS: ajuste o hook conforme seu projeto
// import { useAuthTranslation } from '@shared/hooks/useTranslation'
const T = (k:string)=>k

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
  onSwitchToImport?: () => void
}

export const LoginForm: FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onSwitchToImport
}) => {
  // const { t } = useAuthTranslation()
  const t = T
  const { accounts, login, isLoading, error } = useAuth()
  const { formState, validateField, setFieldError } = useAuthForm()

  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccountId) {
      setFieldError('account', t('selectAccount'))
      return
    }
    const passwordError = validateField('password', password)
    if (passwordError) {
      setFieldError('password', passwordError)
      return
    }
    const success = await login(selectedAccountId, password)
    if (success) onSuccess?.()
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">{t('noAccountsFound')}</p>
        <div className="space-y-2">
          <button onClick={onSwitchToRegister} className="w-full btn-primary">
            {t('createAccount')}
          </button>
          <button onClick={onSwitchToImport} className="w-full btn-secondary">
            {t('importAccount')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('selectAccount')}
        </label>
        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="w-full input-bazari"
          required
        >
          <option value="">{t('chooseAccount')}</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.address.slice(0, 8)}...)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('password')}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full input-bazari"
          placeholder={t('enterPassword')}
          required
        />
        {formState.errors.password && (
          <p className="mt-1 text-sm text-error-600">{formState.errors.password}</p>
        )}
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-3">
          <p className="text-error-700 text-sm">{error}</p>
        </div>
      )}

      <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
        {isLoading ? t('signingIn') : t('signIn')}
      </button>

      <div className="text-center space-y-2">
        <button type="button" onClick={onSwitchToRegister} className="text-primary-600 hover:text-primary-500 text-sm">
          {t('createNewAccount')}
        </button>
        <br />
        <button type="button" onClick={onSwitchToImport} className="text-gray-600 hover:text-gray-500 text-sm">
          {t('importExistingAccount')}
        </button>
      </div>
    </form>
  )
}
// END ETAPA3-AUTH

