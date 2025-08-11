
// BEGIN ETAPA3-AUTH
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Account, AuthSession, AuthCredentials } from '@entities/account'

interface AuthState {
  currentSession: AuthSession | null
  currentAccount: Account | null
  accounts: Account[]
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (account: Account, password: string) => Promise<boolean>
  logout: () => void
  register: (credentials: AuthCredentials, seedPhrase: string) => Promise<Account>
  importAccount: (seedPhrase: string, password: string, name?: string) => Promise<Account>
  switchAccount: (accountId: string, password: string) => Promise<boolean>
  updateAccount: (accountId: string, updates: Partial<Account>) => void
  deleteAccount: (accountId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  refreshSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      currentAccount: null,
      accounts: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (account: Account, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { authService } = await import('../services/authService')
          const isValid = await authService.validateAccountPassword(account, password)
          if (!isValid) throw new Error('Senha incorreta')

          const session: AuthSession = {
            accountId: account.id,
            address: account.address,
            publicKey: account.publicKey,
            isAuthenticated: true,
            loginTime: new Date(),
            lastActivity: new Date()
          }

          set({
            currentSession: session,
            currentAccount: account,
            isAuthenticated: true,
            isLoading: false
          })
          return true
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro no login',
            isLoading: false
          })
          return false
        }
      },

      logout: () => {
        set({
          currentSession: null,
          currentAccount: null,
          isAuthenticated: false,
          error: null
        })
      },

      register: async (credentials, seedPhrase) => {
        set({ isLoading: true, error: null })
        try {
          const { authService } = await import('../services/authService')
          const account = await authService.createAccount(credentials, seedPhrase)
          set(state => ({ accounts: [...state.accounts, account], isLoading: false }))
          return account
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro no registro',
            isLoading: false
          })
          throw error
        }
      },

      importAccount: async (seedPhrase, password, name = 'Conta Importada') => {
        set({ isLoading: true, error: null })
        try {
          const { authService } = await import('../services/authService')
          const account = await authService.importAccount(seedPhrase, password, name)
          set(state => ({ accounts: [...state.accounts, account], isLoading: false }))
          return account
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro na importação',
            isLoading: false
          })
          throw error
        }
      },

      switchAccount: async (accountId, password) => {
        const { accounts } = get()
        const account = accounts.find(a => a.id === accountId)
        if (!account) {
          set({ error: 'Conta não encontrada' })
          return false
        }
        return get().login(account, password)
      },

      updateAccount: (accountId, updates) => {
        set(state => ({
          accounts: state.accounts.map(acc => acc.id === accountId ? { ...acc, ...updates } : acc),
          currentAccount: state.currentAccount?.id === accountId
            ? { ...state.currentAccount, ...updates }
            : state.currentAccount
        }))
      },

      deleteAccount: (accountId) => {
        set(state => {
          const newAccounts = state.accounts.filter(acc => acc.id !== accountId)
          const isCurrent = state.currentAccount?.id === accountId
          return {
            accounts: newAccounts,
            currentAccount: isCurrent ? null : state.currentAccount,
            currentSession: isCurrent ? null : state.currentSession,
            isAuthenticated: isCurrent ? false : state.isAuthenticated
          }
        })
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      refreshSession: () => {
        const s = get().currentSession
        if (s) set({ currentSession: { ...s, lastActivity: new Date() } })
      }
    }),
    {
      name: 'bazari-auth',
      partialize: (state) => ({
        accounts: state.accounts,
        currentAccount: state.currentAccount
      })
    }
  )
)
// END ETAPA3-AUTH

