// src/features/auth/hooks/useAuth.ts
import { useCallback } from 'react'
import { useAuthStore } from '../store/authStore'
import type { AuthCredentials } from '@entities/account'

export function useAuth() {
  const {
    // estado
    currentSession,
    currentAccount,
    accounts,
    isAuthenticated,
    isLoading,
    error,
    // ações
    login,
    logout,
    register,
    importAccount,
    switchAccount,
    updateAccount,
    deleteAccount,
    // utils
    setError,
    clearError,
    refreshSession,
  } = useAuthStore()

  const handleLogin = useCallback(async (accountId: string, password: string) => {
    const account = accounts.find((a) => a.id === accountId)
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

  const handleImport = useCallback(async (seedPhrase: string, password: string, name?: string) => {
    try {
      const account = await importAccount(seedPhrase, password, name)
      return login(account, password)
    } catch {
      return false
    }
  }, [importAccount, login])

  return {
    // estado
    currentSession,
    currentAccount,
    accounts,
    isAuthenticated,
    isLoading,
    error,
    // ações
    login: handleLogin,
    logout,
    register: handleRegister,
    importAccount: handleImport,
    switchAccount,
    updateAccount,
    deleteAccount,
    // utilitários
    clearError,
    refreshSession,
    hasAccounts: accounts.length > 0,
    currentAddress: currentAccount?.address,
    currentPublicKey: currentAccount?.publicKey,
  }
}
