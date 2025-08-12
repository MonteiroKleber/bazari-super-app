import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import type { Account, AuthSession, AuthCredentials } from '@entities/account'

// === NOVO: storage com TTL (24h) ===
const ONE_DAY_MS = 24 * 60 * 60 * 1000

function createTTLStorage(ttlMs = ONE_DAY_MS): StateStorage {
  return {
    getItem: (name: string) => {
      const raw = localStorage.getItem(name)
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw)
        const { v, t } = parsed || {}
        if (typeof t === 'number' && Date.now() - t > ttlMs) {
          localStorage.removeItem(name)
          return null
        }
        return JSON.stringify(v)
      } catch {
        return null
      }
    },
    setItem: (name: string, value: string) => {
      localStorage.setItem(name, JSON.stringify({ v: JSON.parse(value), t: Date.now() }))
    },
    removeItem: (name: string) => localStorage.removeItem(name),
  }
}

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

      login: async (account, password) => {
        set({ isLoading: true, error: null })
        try {
          // ✅ CORREÇÃO: Import com destructuring
          const { authService } = await import('../services/authService')
          const isValid = await authService.validateAccountPassword(account, password)
          if (!isValid) throw new Error('Senha incorreta')

          const session: AuthSession = {
            accountId: account.id,
            address: account.address,
            publicKey: account.publicKey,
            isAuthenticated: true,
            loginTime: new Date(),
            lastActivity: new Date(),
          }

          set({
            currentSession: session,
            currentAccount: account,
            isAuthenticated: true,
            isLoading: false,
          })

          return true
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : 'Erro no login',
            isLoading: false,
          })
          return false
        }
      },

      logout: () => {
        set({
          currentSession: null,
          currentAccount: null,
          isAuthenticated: false,
          error: null,
        })
      },

      register: async (credentials, seedPhrase) => {
        set({ isLoading: true, error: null })
        try {
          // ✅ CORREÇÃO: Import com destructuring - AQUI ESTAVA O ERRO!
          const { authService } = await import('../services/authService')
          const account = await authService.createAccount(credentials, seedPhrase)
          set((state) => ({
            accounts: [...state.accounts, account],
            isLoading: false,
          }))
          return account
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : 'Erro no registro',
            isLoading: false,
          })
          throw e
        }
      },

      importAccount: async (seedPhrase, password, name = 'Conta Importada') => {
        set({ isLoading: true, error: null })
        try {
          // ✅ CORREÇÃO: Import com destructuring
          const { authService } = await import('../services/authService')
          const account = await authService.importAccount(seedPhrase, password, name)
          set((state) => ({
            accounts: [...state.accounts, account],
            isLoading: false,
          }))
          return account
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : 'Erro na importação',
            isLoading: false,
          })
          throw e
        }
      },

      switchAccount: async (accountId, password) => {
        const account = get().accounts.find((a) => a.id === accountId)
        if (!account) {
          set({ error: 'Conta não encontrada' })
          return false
        }
        return get().login(account, password)
      },

      updateAccount: (accountId, updates) => {
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === accountId ? { ...a, ...updates } : a)),
          currentAccount:
            state.currentAccount?.id === accountId
              ? { ...state.currentAccount, ...updates }
              : state.currentAccount,
        }))
      },

      deleteAccount: (accountId) => {
        set((state) => {
          const next = state.accounts.filter((a) => a.id !== accountId)
          const isCurrent = state.currentAccount?.id === accountId
          return {
            accounts: next,
            currentAccount: isCurrent ? null : state.currentAccount,
            currentSession: isCurrent ? null : state.currentSession,
            isAuthenticated: isCurrent ? false : state.isAuthenticated,
          }
        })
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      refreshSession: () => {
        const s = get()
        if (s.currentSession) {
          set({
            currentSession: { ...s.currentSession, lastActivity: new Date() },
          })
        }
      },
    }),
    {
      name: 'bazari-auth',
      storage: createJSONStorage(() => createTTLStorage()),
      partialize: (state) => ({
        accounts: state.accounts,
        currentAccount: state.currentAccount,
        currentSession: state.currentSession,    // ✅ ADICIONAR 
        isAuthenticated: state.isAuthenticated,  // ✅ ADICIONAR
      }),
      version: 1,
    }
  )
)