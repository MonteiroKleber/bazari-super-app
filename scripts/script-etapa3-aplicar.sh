#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Bazari — ETAPA 3 (unificado): --dry-run/-n ou execução real
# - Lê o payload embutido entre __PAYLOAD_START__/__PAYLOAD_END__
# - Cria pastas/arquivos; em arquivos existentes faz append com bloco marcado
# - Para JSON existente, gera *.auth.patch.json (merge manual)
# =============================================================================

MARKER_NAME="ETAPA3-AUTH"
BEGIN_MARK="// BEGIN ${MARKER_NAME}"
END_MARK="// END ${MARKER_NAME}"

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" || "${1:-}" == "-n" ]]; then
  DRY_RUN=1
fi

ts() { date +"%Y-%m-%d %H:%M:%S"; }

log() { # $1=level $2=msg
  local lvl="$1"; shift
  local msg="$*"
  case "$lvl" in
    OK)    printf "\033[36m[DIR OK]\033[0m %s\n" "$msg" ;;
    NEWD)  printf "\033[32m[CREATE DIR]\033[0m %s\n" "$msg" ;;
    NEWF)  printf "\033[32m[CREATE FILE]\033[0m %s\n" "$msg" ;;
    APP)   printf "\033[33m[APPEND MARKED]\033[0m %s\n" "$msg" ;;
    SKIP)  printf "\033[36m[SKIP]\033[0m %s\n" "$msg" ;;
    JNEW)  printf "\033[32m[JSON CREATE]\033[0m %s\n" "$msg" ;;
    JPTC)  printf "\033[33m[JSON PATCH]\033[0m %s\n" "$msg" ;;
    INFO)  printf "\033[37m[i]\033[0m %s\n" "$msg" ;;
  esac
}

ensure_dir() {
  local path="$1"
  local dir; dir="$(dirname "$path")"
  if [[ ! -d "$dir" ]]; then
    log NEWD "$dir"
    [[ $DRY_RUN -eq 0 ]] && mkdir -p "$dir"
  else
    log OK "$dir"
  fi
}

has_marker() {
  local file="$1"
  [[ -f "$file" ]] && grep -Fq "$BEGIN_MARK" "$file"
}

append_block_marked() {
  local file="$1" ; shift
  local content="$*"

  if has_marker "$file"; then
    log SKIP "$file (já contém bloco ${MARKER_NAME})"
    return 0
  fi

  log APP "$file (adicionar bloco ${MARKER_NAME})"
  if [[ $DRY_RUN -eq 0 ]]; then
    {
      echo ""
      echo "$BEGIN_MARK"
      echo "$content"
      echo "$END_MARK"
      echo ""
    } >> "$file"
  fi
}

write_or_append() {
  local file="$1" ; shift
  local raw_content="$*"

  ensure_dir "$file"

  if [[ "$file" == *.json ]]; then
    if [[ -f "$file" ]]; then
      local patch="${file%.*}.auth.patch.json"
      log JPTC "$file  ->  $(basename "$patch")"
      [[ $DRY_RUN -eq 0 ]] && printf "%s\n" "$raw_content" > "$patch"
    else
      log JNEW "$file"
      [[ $DRY_RUN -eq 0 ]] && printf "%s\n" "$raw_content" > "$file"
    fi
    return 0
  fi

  if [[ -f "$file" ]]; then
    append_block_marked "$file" "$raw_content"
  else
    log NEWF "$file"
    [[ $DRY_RUN -eq 0 ]] && printf "%s\n" "$raw_content" > "$file"
  fi
}

# -----------------------------------------------------------------------------
# Leitor de payload do próprio script
# -----------------------------------------------------------------------------
extract_and_apply_payload() {
  local in_payload=0 path="" buffer=""

  if [[ $DRY_RUN -eq 1 ]]; then
    log INFO "Executando em DRY‑RUN (nenhuma alteração será feita)."
  else
    log INFO "Aplicando alterações (modo real)."
  fi

  while IFS= read -r line; do
    if [[ "$line" == "__PAYLOAD_START__" ]]; then
      in_payload=1
      continue
    fi
    if [[ "$line" == "__PAYLOAD_END__" ]]; then
      [[ -n "$path" ]] && write_or_append "$path" "$buffer"
      break
    fi
    [[ $in_payload -eq 0 ]] && continue

    if [[ "$line" =~ ^@@\ PATH= ]]; then
      # fecha bloco anterior
      if [[ -n "$path" ]]; then
        write_or_append "$path" "$buffer"
        buffer=""
      fi
      path="${line#@@ PATH=}"
      continue
    fi

    if [[ "$line" == "@@ END" ]]; then
      write_or_append "$path" "$buffer"
      path=""; buffer=""
      continue
    fi

    # acumula conteúdo literal
    if [[ -z "$buffer" ]]; then
      buffer="$line"
    else
      buffer="${buffer}"$'\n'"${line}"
    fi
  done < "$0"

  if [[ $DRY_RUN -eq 1 ]]; then
    log INFO "Dry‑run concluído. Nada foi modificado."
  else
    log INFO "Aplicação concluída com sucesso."
  fi
}

extract_and_apply_payload
exit 0

# (mantenha o payload abaixo exatamente como já está)

__PAYLOAD_START__
@@ PATH=src/entities/account.ts
export interface Account {
  id: string
  address: string
  publicKey: string
  encryptedPrivateKey: string // Criptografado com senha do usuário
  seedPhraseHash: string // Hash da seed phrase para verificação
  derivationPath: string
  name: string
  isDefault: boolean
  createdAt: Date
  lastAccessAt: Date
}

export interface AuthSession {
  accountId: string
  address: string
  publicKey: string
  isAuthenticated: boolean
  loginTime: Date
  lastActivity: Date
}

export interface WalletKeyPair {
  publicKey: string
  privateKey: string
  address: string
  seedPhrase: string
}

export interface AuthCredentials {
  password: string
  confirmPassword?: string
}

export interface SeedPhraseValidation {
  phrase: string
  positions: number[] // Posições para confirmação (ex: [2, 5, 8])
  userInputs: string[] // Palavras inseridas pelo usuário
}
@@ END
@@ PATH=src/features/auth/store/authStore.ts
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
@@ END
@@ PATH=src/features/auth/services/authService.ts
import { nanoid } from 'nanoid'
import type { Account, AuthCredentials } from '@entities/account'
import { cryptoService } from './cryptoService'
import { walletService } from './walletService'

class AuthService {
  async createAccount(credentials: AuthCredentials, seedPhrase: string): Promise<Account> {
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Senhas não coincidem')
    }
    if ((credentials.password || '').length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres')
    }

    const walletKeys = await walletService.generateKeysFromSeed(seedPhrase)
    const encryptedPrivateKey = await cryptoService.encrypt(walletKeys.privateKey, credentials.password)
    const seedPhraseHash = await cryptoService.hash(seedPhrase)

    const account: Account = {
      id: nanoid(),
      address: walletKeys.address,
      publicKey: walletKeys.publicKey,
      encryptedPrivateKey,
      seedPhraseHash,
      derivationPath: "//0",
      name: 'Minha Conta',
      isDefault: true,
      createdAt: new Date(),
      lastAccessAt: new Date()
    }
    return account
  }

  async importAccount(seedPhrase: string, password: string, name: string): Promise<Account> {
    if (!this.validateSeedPhrase(seedPhrase)) {
      throw new Error('Seed phrase inválida')
    }
    const walletKeys = await walletService.generateKeysFromSeed(seedPhrase)
    const encryptedPrivateKey = await cryptoService.encrypt(walletKeys.privateKey, password)
    const seedPhraseHash = await cryptoService.hash(seedPhrase)

    return {
      id: nanoid(),
      address: walletKeys.address,
      publicKey: walletKeys.publicKey,
      encryptedPrivateKey,
      seedPhraseHash,
      derivationPath: "//0",
      name,
      isDefault: false,
      createdAt: new Date(),
      lastAccessAt: new Date()
    }
  }

  async validateAccountPassword(account: Account, password: string): Promise<boolean> {
    try {
      await cryptoService.decrypt(account.encryptedPrivateKey, password)
      return true
    } catch {
      return false
    }
  }

  async getDecryptedPrivateKey(account: Account, password: string): Promise<string> {
    return cryptoService.decrypt(account.encryptedPrivateKey, password)
  }

  validateSeedPhrase(seedPhrase: string): boolean {
    const words = seedPhrase.trim().split(/\s+/)
    return words.length === 12 || words.length === 24
  }

  generateSeedPhrase(): string {
    return walletService.generateSeedPhrase()
  }

  async recoverAccount(seedPhrase: string): Promise<{ address: string; publicKey: string }> {
    if (!this.validateSeedPhrase(seedPhrase)) throw new Error('Seed phrase inválida')
    const walletKeys = await walletService.generateKeysFromSeed(seedPhrase)
    return { address: walletKeys.address, publicKey: walletKeys.publicKey }
  }
}

export const authService = new AuthService()
@@ END
@@ PATH=src/features/auth/services/cryptoService.ts
class CryptoService {
  async encrypt(data: string, password: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const key = await this.deriveKey(password, salt)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    )

    const result = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength)
    result.set(salt, 0)
    result.set(iv, salt.length)
    result.set(new Uint8Array(encryptedBuffer), salt.length + iv.length)

    return btoa(String.fromCharCode(...result))
  }

  async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)))
      const salt = data.slice(0, 16)
      const iv = data.slice(16, 28)
      const encrypted = data.slice(28)
      const key = await this.deriveKey(password, salt)
      const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
      const decoder = new TextDecoder()
      return decoder.decode(decryptedBuffer)
    } catch {
      throw new Error('Falha na descriptografia - senha incorreta?')
    }
  }

  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    const baseKey = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey'])
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  async hash(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = new Uint8Array(hashBuffer)
    return btoa(String.fromCharCode(...hashArray))
  }

  generateRandomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length))
  }
}

export const cryptoService = new CryptoService()
@@ END
@@ PATH=src/features/auth/services/walletService.ts
import type { WalletKeyPair } from '@entities/account'

class WalletService {
  generateSeedPhrase(): string {
    const wordlist = [
      'abandon','ability','able','about','above','absent','absorb','abstract',
      'absurd','abuse','access','accident','account','accuse','achieve','acid',
      'acoustic','acquire','across','act','action','actor','actress','actual',
      'adapt','add','addict','address','adjust','admit','adult','advance',
      'advice','aerobic','affair','afford','afraid','again','against','agent',
      'agree','ahead','aim','air','airport','aisle','alarm','album',
      'alcohol','alert','alien','all','alley','allow','almost','alone',
      'alpha','already','also','alter','always','amateur','amazing','among'
    ]
    const words: string[] = []
    for (let i = 0; i < 12; i++) {
      const idx = Math.floor(Math.random() * wordlist.length)
      words.push(wordlist[idx])
    }
    return words.join(' ')
  }

  async generateKeysFromSeed(seedPhrase: string): Promise<WalletKeyPair> {
    const seedBytes = new TextEncoder().encode(seedPhrase)
    const pkHash = await crypto.subtle.digest('SHA-256', seedBytes)
    const privateKey = Array.from(new Uint8Array(pkHash)).map(b => b.toString(16).padStart(2,'0')).join('')

    const pubHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(privateKey))
    const publicKey = Array.from(new Uint8Array(pubHash)).map(b => b.toString(16).padStart(2,'0')).join('')

    const addrHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(publicKey))
    const address = '5' + Array.from(new Uint8Array(addrHash.slice(0,16))).map(b => b.toString(16).padStart(2,'0')).join('')

    return { privateKey, publicKey, address, seedPhrase }
  }

  validateAddress(address: string): boolean {
    return address.length >= 32 && address.startsWith('5')
  }

  async signTransaction(privateKey: string, transaction: string): Promise<string> {
    const data = new TextEncoder().encode(privateKey + transaction)
    const sigHash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(sigHash)).map(b => b.toString(16).padStart(2,'0')).join('')
  }
}

export const walletService = new WalletService()
@@ END
@@ PATH=src/features/auth/hooks/useAuth.ts
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
@@ END
@@ PATH=src/features/auth/hooks/useAuthForm.ts
import { useState, useCallback } from 'react'
import { authService } from '../services/authService'

interface FormState {
  isValid: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}

export function useAuthForm() {
  const [formState, setFormState] = useState<FormState>({
    isValid: false,
    errors: {},
    touched: {}
  })

  const validatePassword = useCallback((password: string): string | null => {
    if (!password) return 'Senha é obrigatória'
    if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Senha deve conter ao menos: 1 minúscula, 1 maiúscula e 1 número'
    }
    return null
  }, [])

  const validatePasswordConfirmation = useCallback((password: string, confirmation: string): string | null => {
    if (!confirmation) return 'Confirmação de senha é obrigatória'
    if (password !== confirmation) return 'Senhas não coincidem'
    return null
  }, [])

  const validateSeedPhrase = useCallback((seedPhrase: string): string | null => {
    if (!seedPhrase) return 'Seed phrase é obrigatória'
    if (!authService.validateSeedPhrase(seedPhrase)) return 'Seed phrase deve ter 12 ou 24 palavras'
    return null
  }, [])

  const validateField = useCallback((name: string, value: string, extraData?: any): string | null => {
    switch (name) {
      case 'password': return validatePassword(value)
      case 'confirmPassword': return validatePasswordConfirmation(extraData?.password || '', value)
      case 'seedPhrase': return validateSeedPhrase(value)
      case 'accountName': return !value ? 'Nome da conta é obrigatório' : null
      default: return null
    }
  }, [validatePassword, validatePasswordConfirmation, validateSeedPhrase])

  const setFieldError = useCallback((field: string, error: string | null) => {
    const nextErrors = (prev: Record<string,string>) => ({ ...prev, [field]: error || '' })
    setFormState(prev => {
      const errors = nextErrors(prev.errors)
      const isValid = Object.values(errors).every(e => !e)
      return { ...prev, errors, isValid }
    })
  }, [])

  const setFieldTouched = useCallback((field: string, touched = true) => {
    setFormState(prev => ({ ...prev, touched: { ...prev.touched, [field]: touched } }))
  }, [])

  const resetForm = useCallback(() => {
    setFormState({ isValid: false, errors: {}, touched: {} })
  }, [])

  return {
    formState,
    validateField,
    setFieldError,
    setFieldTouched,
    resetForm,
    validatePassword,
    validatePasswordConfirmation,
    validateSeedPhrase
  }
}
@@ END
@@ PATH=src/features/auth/hooks/useWalletGeneration.ts
import { useState, useCallback } from 'react'
import { authService } from '../services/authService'
import type { SeedPhraseValidation } from '@entities/account'

export function useWalletGeneration() {
  const [seedPhrase, setSeedPhrase] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [confirmationStep, setConfirmationStep] = useState<SeedPhraseValidation | null>(null)

  const generateNewSeedPhrase = useCallback(async () => {
    setIsGenerating(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      const sp = authService.generateSeedPhrase()
      setSeedPhrase(sp)
      return sp
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const startConfirmation = useCallback((phrase: string) => {
    const words = phrase.split(' ')
    const positions: number[] = []
    while (positions.length < 3) {
      const pos = Math.floor(Math.random() * words.length)
      if (!positions.includes(pos)) positions.push(pos)
    }
    positions.sort((a,b)=>a-b)
    setConfirmationStep({ phrase, positions, userInputs: new Array(3).fill('') })
  }, [])

  const updateConfirmationInput = useCallback((index: number, value: string) => {
    setConfirmationStep(prev => {
      if (!prev) return null
      const newInputs = [...prev.userInputs]
      newInputs[index] = value.toLowerCase().trim()
      return { ...prev, userInputs: newInputs }
    })
  }, [])

  const validateConfirmation = useCallback((): boolean => {
    if (!confirmationStep) return false
    const words = confirmationStep.phrase.split(' ')
    return confirmationStep.positions.every((pos, idx) => words[pos] === confirmationStep.userInputs[idx])
  }, [confirmationStep])

  const resetConfirmation = useCallback(() => setConfirmationStep(null), [])
  const reset = useCallback(() => { setSeedPhrase(''); setConfirmationStep(null) }, [])

  return {
    seedPhrase,
    isGenerating,
    confirmationStep,
    generateNewSeedPhrase,
    startConfirmation,
    updateConfirmationInput,
    validateConfirmation,
    resetConfirmation,
    reset,
    isConfirmationComplete: confirmationStep ? confirmationStep.userInputs.every(i => i.length > 0) : false
  }
}
@@ END
@@ PATH=src/shared/guards/AuthGuard.tsx
import { FC, ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback?: string
}

export const AuthGuard: FC<AuthGuardProps> = ({ children, fallback = '/auth/login' }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />
  }

  return <>{children}</>
}
@@ END
@@ PATH=src/shared/guards/RouteGuard.tsx
import { FC, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

interface RouteGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireNoAuth?: boolean
  fallbackAuth?: string
  fallbackNoAuth?: string
}

export const RouteGuard: FC<RouteGuardProps> = ({
  children,
  requireAuth = false,
  requireNoAuth = false,
  fallbackAuth = '/auth/login',
  fallbackNoAuth = '/dashboard'
}) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) return <Navigate to={fallbackAuth} replace />
  if (requireNoAuth && isAuthenticated) return <Navigate to={fallbackNoAuth} replace />
  return <>{children}</>
}
@@ END
@@ PATH=src/features/auth/components/LoginForm.tsx
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
@@ END
@@ PATH=src/features/auth/components/SeedPhraseConfirmation.tsx
import { FC } from 'react'
import { useWalletGeneration } from '../hooks/useWalletGeneration'
// import { useAuthTranslation } from '@shared/hooks/useTranslation'
const T = (k:string)=>k

interface SeedPhraseConfirmationProps {
  onConfirm: () => void
  onBack: () => void
}

export const SeedPhraseConfirmation: FC<SeedPhraseConfirmationProps> = ({
  onConfirm,
  onBack
}) => {
  // const { t } = useAuthTranslation()
  const t = T
  const {
    confirmationStep,
    updateConfirmationInput,
    validateConfirmation,
    isConfirmationComplete
  } = useWalletGeneration()

  if (!confirmationStep) return null

  const handleConfirm = () => {
    if (validateConfirmation()) onConfirm()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('confirmSeedPhrase')}
        </h3>
        <p className="text-gray-600">
          {t('confirmSeedPhraseDescription')}
        </p>
      </div>

      <div className="space-y-4">
        {confirmationStep.positions.map((position, index) => (
          <div key={position}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('wordAtPosition', { position: position + 1 } as any)}
            </label>
            <input
              type="text"
              value={confirmationStep.userInputs[index]}
              onChange={(e) => updateConfirmationInput(index, e.target.value)}
              className="w-full input-bazari"
              placeholder={t('enterWord')}
              autoComplete="off"
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button type="button" onClick={onBack} className="flex-1 btn-secondary">
          {t('back')}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!isConfirmationComplete || !validateConfirmation()}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          {t('confirm')}
        </button>
      </div>
    </div>
  )
}
@@ END
@@ PATH=src/pages/auth/LoginPage.tsx
import { FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginForm } from '@features/auth/components/LoginForm'
import { AuthLayout } from '@features/auth/components/AuthLayout'
// import { useAuthTranslation } from '@shared/hooks/useTranslation'
const T = (k:string)=>k

export const LoginPage: FC = () => {
  // const { t } = useAuthTranslation()
  const t = T
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location as any).state?.from?.pathname || '/dashboard'

  return (
    <AuthLayout title={t('signIn')} subtitle={t('signInToYourAccount')}>
      <LoginForm
        onSuccess={() => navigate(from, { replace: true })}
        onSwitchToRegister={() => navigate('/auth/register')}
        onSwitchToImport={() => navigate('/auth/import')}
      />
    </AuthLayout>
  )
}
@@ END
@@ PATH=src/pages/auth/RegisterPage.tsx
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
@@ END
@@ PATH=src/pages/auth/ImportAccountPage.tsx
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImportAccountForm } from '@features/auth/components/ImportAccountForm'
import { AuthLayout } from '@features/auth/components/AuthLayout'

export const ImportAccountPage: FC = () => {
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Importar Conta"
      subtitle="Importe sua carteira existente"
      showBackButton
      onBack={() => navigate('/auth/login')}
    >
      <ImportAccountForm
        onSuccess={() => navigate('/dashboard')}
        onCancel={() => navigate('/auth/login')}
      />
    </AuthLayout>
  )
}
@@ END
@@ PATH=src/pages/auth/RecoveryPage.tsx
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecoveryForm } from '@features/auth/components/RecoveryForm'
import { AuthLayout } from '@features/auth/components/AuthLayout'

export const RecoveryPage: FC = () => {
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Recuperar Conta"
      subtitle="Encontre o endereço gerado pela sua seed phrase"
      showBackButton
      onBack={() => navigate('/auth/login')}
    >
      <RecoveryForm
        onSuccess={() => navigate('/auth/login')}
        onCancel={() => navigate('/auth/login')}
      />
    </AuthLayout>
  )
}
@@ END
@@ PATH=src/features/auth/components/RegisterForm.tsx
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
@@ END
@@ PATH=src/features/auth/components/SeedPhraseDisplay.tsx
import { FC, useState } from 'react'
import { useWalletGeneration } from '../hooks/useWalletGeneration'

interface SeedPhraseDisplayProps {
  onContinue: () => void
}

export const SeedPhraseDisplay: FC<SeedPhraseDisplayProps> = ({ onContinue }) => {
  const { seedPhrase, startConfirmation } = useWalletGeneration()
  const [isRevealed, setIsRevealed] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const words = seedPhrase.split(' ')

  const handleReveal = () => setIsRevealed(true)
  const handleCopyToClipboard = async () => {
    try { await navigator.clipboard.writeText(seedPhrase) } catch {}
  }
  const handleContinue = () => { startConfirmation(seedPhrase); onContinue() }

  return (
    <div className="space-y-6">
      <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
        <div className="text-sm text-warning-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>Nunca compartilhe sua frase de recuperação</li>
            <li>Anote em local seguro</li>
            <li>Não perca sua frase — ela é sua conta</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {!isRevealed ? (
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-8 mb-4">
              <p className="text-gray-600">Clique para revelar sua seed phrase</p>
            </div>
            <button onClick={handleReveal} className="btn-primary">Revelar seed phrase</button>
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {words.map((word, index) => (
                  <div key={index} className="bg-white rounded px-3 py-2 text-center text-sm border">
                    <span className="text-gray-500 text-xs">{index + 1}.</span>
                    <span className="ml-1 font-medium">{word}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleCopyToClipboard} className="w-full text-primary-600 hover:text-primary-500 text-sm py-2">
                📋 Copiar para área de transferência
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="confirmed"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="confirmed" className="ml-2 block text-sm text-gray-900">
                Confirmo que salvei minha seed phrase
              </label>
            </div>
          </div>
        )}
      </div>

      {isRevealed && (
        <button onClick={handleContinue} disabled={!isConfirmed} className="w-full btn-primary disabled:opacity-50">
          Continuar
        </button>
      )}
    </div>
  )
}
@@ END
@@ PATH=src/features/auth/components/AuthLayout.tsx
import { FC, ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
}

export const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-secondary-500 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-900">B</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Bazari</h1>
          <p className="text-secondary-300">Super App Web3</p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="mb-6">
            {showBackButton && (
              <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          </div>

          {children}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-secondary-300">© 2025 Bazari - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  )
}
@@ END
@@ PATH=src/app/i18n/translations.json
{
  "auth": {
    "signIn": { "pt": "Entrar", "en": "Sign In", "es": "Iniciar Sesión" },
    "signInToYourAccount": { "pt": "Acesse sua conta", "en": "Sign in to your account", "es": "Accede a tu cuenta" },
    "createAccount": { "pt": "Criar Conta", "en": "Create Account", "es": "Crear Cuenta" },
    "createNewAccountDescription": { "pt": "Crie sua conta Web3 segura", "en": "Create your secure Web3 account", "es": "Crea tu cuenta Web3 segura" },
    "importAccount": { "pt": "Importar Conta", "en": "Import Account", "es": "Importar Cuenta" },
    "importAccountDescription": { "pt": "Importe sua carteira existente", "en": "Import your existing wallet", "es": "Importa tu billetera existente" },
    "recoverAccount": { "pt": "Recuperar Conta", "en": "Recover Account", "es": "Recuperar Cuenta" },
    "password": { "pt": "Senha", "en": "Password", "es": "Contraseña" },
    "confirmPassword": { "pt": "Confirmar Senha", "en": "Confirm Password", "es": "Confirmar Contraseña" },
    "seedPhrase": { "pt": "Frase de Recuperação", "en": "Seed Phrase", "es": "Frase de Recuperación" },
    "confirmSeedPhrase": { "pt": "Confirmar Frase de Recuperação", "en": "Confirm Seed Phrase", "es": "Confirmar Frase de Recuperación" },
    "selectAccount": { "pt": "Selecionar Conta", "en": "Select Account", "es": "Seleccionar Cuenta" },
    "noAccountsFound": { "pt": "Nenhuma conta encontrada", "en": "No accounts found", "es": "No se encontraron cuentas" },
    "accountCreated": { "pt": "Conta Criada!", "en": "Account Created!", "es": "¡Cuenta Creada!" },
    "saveYourSeedPhrase": { "pt": "Guarde sua frase de recuperação", "en": "Save your seed phrase", "es": "Guarda tu frase de recuperación" },
    "neverShareSeedPhrase": { "pt": "Nunca compartilhe sua frase de recuperação", "en": "Never share your seed phrase", "es": "Nunca compartas tu frase de recuperación" },
    "writeDownSafely": { "pt": "Anote em local seguro", "en": "Write it down in a safe place", "es": "Escríbela en un lugar seguro" },
    "mustAgreeToTerms": { "pt": "Você deve aceitar os termos", "en": "You must agree to the terms", "es": "Debes aceptar los términos" },
    "confirmedSeedPhraseSaved": { "pt": "Confirmei que salvei minha frase de recuperação", "en": "I confirmed that I saved my seed phrase", "es": "Confirmé que guardé mi frase de recuperación" },
    "enterSeedPhrase": { "pt": "Digite sua frase de recuperação", "en": "Enter your seed phrase", "es": "Ingresa tu frase de recuperación" },
    "seedPhraseHelpText": { "pt": "Digite 12 ou 24 palavras separadas por espaços", "en": "Enter 12 or 24 words separated by spaces", "es": "Ingresa 12 o 24 palabras separadas por espacios" },
    "createPasswordForAccount": { "pt": "Crie uma senha para esta conta", "en": "Create a password for this account", "es": "Crea una contraseña para esta cuenta" },
    "importingAccount": { "pt": "Importando conta...", "en": "Importing account...", "es": "Importando cuenta..." },
    "enterSeedPhraseToRecover": { "pt": "Digite sua frase de recuperação para encontrar sua conta", "en": "Enter your seed phrase to find your account", "es": "Ingresa tu frase de recuperación para encontrar tu cuenta" },
    "recoveryInformation": { "pt": "Informações sobre Recuperação", "en": "Recovery Information", "es": "Información de Recuperación" },
    "recoveryInformationText": { "pt": "Esta função permite verificar se sua frase de recuperação é válida e qual endereço ela gera. Para acessar sua conta, você precisará importá-la com uma nova senha.", "en": "This function allows you to verify if your seed phrase is valid and which address it generates. To access your account, you'll need to import it with a new password.", "es": "Esta función te permite verificar si tu frase de recuperación es válida y qué dirección genera. Para acceder a tu cuenta, necesitarás importarla con una nueva contraseña." },
    "recovering": { "pt": "Recuperando...", "en": "Recovering...", "es": "Recuperando..." },
    "accountFoundSuccessfully": { "pt": "Conta encontrada com sucesso!", "en": "Account found successfully!", "es": "¡Cuenta encontrada exitosamente!" },
    "recoveryNextSteps": { "pt": "Para acessar esta conta, vá para 'Importar Conta' e use a mesma frase de recuperação com uma nova senha.", "en": "To access this account, go to 'Import Account' and use the same seed phrase with a new password.", "es": "Para acceder a esta cuenta, ve a 'Importar Cuenta' y usa la misma frase de recuperación con una nueva contraseña." },
    "proceedToImport": { "pt": "Prosseguir para Importação", "en": "Proceed to Import", "es": "Proceder a Importar" },
    "congratulations": { "pt": "Parabéns!", "en": "Congratulations!", "es": "¡Felicidades!" },
    "accountCreatedSuccessfully": { "pt": "Sua conta foi criada com sucesso!", "en": "Your account has been created successfully!", "es": "¡Tu cuenta ha sido creada exitosamente!" },
    "redirectingToDashboard": { "pt": "Redirecionando para o dashboard em {{seconds}} segundos...", "en": "Redirecting to dashboard in {{seconds}} seconds...", "es": "Redirigiendo al dashboard en {{seconds}} segundos..." },
    "accountSecurelyCreated": { "pt": "Conta criada com segurança", "en": "Account securely created", "es": "Cuenta creada de forma segura" },
    "seedPhraseSaved": { "pt": "Frase de recuperação salva", "en": "Seed phrase saved", "es": "Frase de recuperación guardada" },
    "readyToUse": { "pt": "Pronto para usar Bazari", "en": "Ready to use Bazari", "es": "Listo para usar Bazari" },
    "recoveryError": { "pt": "Erro na recuperação da conta", "en": "Account recovery error", "es": "Error en la recuperación de cuenta" }
  },
  "common": {
    "web3SuperApp": { "pt": "Super App Web3", "en": "Web3 Super App", "es": "Super App Web3" },
    "allRightsReserved": { "pt": "Todos os direitos reservados", "en": "All rights reserved", "es": "Todos los derechos reservados" },
    "address": { "pt": "Endereço", "en": "Address", "es": "Dirección" },
    "publicKey": { "pt": "Chave Pública", "en": "Public Key", "es": "Clave Pública" }
  }
}
@@ END
@@ PATH=src/app/routes/authRoutes.tsx
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { RouteGuard } from '@shared/guards/RouteGuard'

const LoginPage = lazy(() => import('@pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ImportAccountPage = lazy(() => import('@pages/auth/ImportAccountPage').then(m => ({ default: m.ImportAccountPage })))
const RecoveryPage = lazy(() => import('@pages/auth/RecoveryPage').then(m => ({ default: m.RecoveryPage })))

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <RouteGuard requireNoAuth fallbackNoAuth="/dashboard">
            <LoginPage />
          </RouteGuard>
        )
      },
      {
        path: 'register',
        element: (
          <RouteGuard requireNoAuth fallbackNoAuth="/dashboard">
            <RegisterPage />
          </RouteGuard>
        )
      },
      {
        path: 'import',
        element: (
          <RouteGuard requireNoAuth fallbackNoAuth="/dashboard">
            <ImportAccountPage />
          </RouteGuard>
        )
      },
      {
        path: 'recovery',
        element: (
          <RouteGuard requireNoAuth fallbackNoAuth="/dashboard">
            <RecoveryPage />
          </RouteGuard>
        )
      }
    ]
  }
]
@@ END
@@ PATH=src/features/auth/components/ImportAccountForm.tsx
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
@@ END
@@ PATH=src/features/auth/components/RecoveryForm.tsx
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
@@ END
@@ PATH=src/features/auth/components/RegistrationSuccess.tsx
import { FC, useEffect, useState } from 'react'

export const RegistrationSuccess: FC = () => {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-success-100 p-6">
          <svg className="h-12 w-12 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Parabéns!</h3>
        <p className="text-gray-600">Sua conta foi criada com sucesso!</p>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-primary-700">Redirecionando para o dashboard em {countdown} segundos...</p>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>✅ Conta criada com segurança</p>
        <p>✅ Frase de recuperação salva</p>
        <p>✅ Pronto para usar o Bazari</p>
      </div>
    </div>
  )
}
@@ END
@@ PATH=src/features/auth/README.md
# 🔐 Sistema de Autenticação Web3 Bazari

Sistema completo de autenticação Web3 com suporte a múltiplas contas, criptografia local e gerenciamento seguro de chaves.

## Hooks
- `useAuth()` — estado e ações de autenticação
- `useAuthForm()` — validação de formulários
- `useWalletGeneration()` — geração/confirm. da seed phrase

## Componentes
- `LoginForm`, `RegisterForm`, `ImportAccountForm`
- `SeedPhraseDisplay`, `SeedPhraseConfirmation`
- `AuthLayout`, `RegistrationSuccess`

## Páginas
- `LoginPage`, `RegisterPage`, `ImportAccountPage`, `RecoveryPage`

## Segurança
- AES-GCM + PBKDF2 (100k iterações), salt aleatório
- Chaves privadas sempre criptografadas
- Persistência somente de dados não sensíveis

## Fluxos
- Registro → Gera e confirma seed phrase → cria conta → login
- Importação → Valida seed → define senha → login
- Recuperação → Mostra endereço/chave pública → seguir para Importar
@@ END
__PAYLOAD_END__
