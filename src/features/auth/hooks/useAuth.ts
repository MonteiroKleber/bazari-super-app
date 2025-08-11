
// BEGIN ETAPA3-AUTH
import { useAuthStore } from '../store/authStore'
import { useCallback } from 'react'
import type { AuthCredentials } from '@entities/account'

export function useAuth() {
  const {
    currentSession,
    currentAccount,
    accounts,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    importAccount,
    switchAccount,
    updateAccount,
    deleteAccount,
    setError,
    clearError,
    refreshSession
  } = useAuthStore()

  const handleLogin = useCallback(async (accountId: string, password: string) => {
    const account = accounts.find(acc => acc.id === accountId)
    if (!account) {
      setError('Conta não encontrada')
      return false
    }
    return login(account, password)
  }, [accounts, login, setError])

  const handleRegister = useCallback(async (credentials: AuthCredentials, seedPhrase: string) => {
    try {
      const account = await register(credentials, seedPhrase)
      return login(account, credentials.password)
    } catch {
      return false
    }
  }, [register, login])

  const handleImportAccount = useCallback(async (seedPhrase: string, password: string, name?: string) => {
    try {
      const account = await importAccount(seedPhrase, password, name)
      return login(account, password)
    } catch {
      return false
    }
  }, [importAccount, login])

  return {
    currentSession,
    currentAccount,
    accounts,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout,
    register: handleRegister,
    importAccount: handleImportAccount,
    switchAccount,
    updateAccount,
    deleteAccount,
    clearError,
    refreshSession,
    hasAccounts: accounts.length > 0,
    currentAddress: currentAccount?.address,
    currentPublicKey: currentAccount?.publicKey
  }
}
// END ETAPA3-AUTH

