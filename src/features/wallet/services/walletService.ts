// src/features/wallet/services/walletService.ts

/**
 * Serviço da Wallet - Gerencia contas, persistência e integração com Substrate
 * Usa localStorage para persistir dados das contas e preferências
 */

import { createSubstrateClient, SubstrateClient } from '../substrate/substrateClient'
import type { 
  WalletAccount, 
  TokenBalance, 
  NftItem, 
  Transaction, 
  PaginationParams, 
  PaginatedResult 
} from '../substrate/substrateClient'

// ========================================
// CONSTANTS & STORAGE KEYS
// ========================================
const STORAGE_KEYS = {
  ACCOUNTS: 'bazari.wallet.v1.accounts',
  ACTIVE_ACCOUNT_ID: 'bazari.wallet.v1.activeAccountId',
  PREFERENCES: 'bazari.wallet.v1.preferences',
} as const

interface WalletPreferences {
  autoConnect: boolean
  showTestNetworks: boolean
  defaultGasPrice: string
}

// ========================================
// WALLET SERVICE CLASS
// ========================================
export class WalletService {
  private substrateClient: SubstrateClient
  private accounts: WalletAccount[] = []
  private activeAccountId: string | null = null

  constructor() {
    this.substrateClient = createSubstrateClient()
    this.loadFromStorage()
    
    console.log('✅ WalletService inicializado')
  }

  // ========================================
  // STORAGE MANAGEMENT
  // ========================================
  private loadFromStorage(): void {
    try {
      // Carregar contas
      const storedAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)
      if (storedAccounts) {
        this.accounts = JSON.parse(storedAccounts)
      }

      // Carregar conta ativa
      const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ACCOUNT_ID)
      if (storedActiveId && this.accounts.find(acc => acc.id === storedActiveId)) {
        this.activeAccountId = storedActiveId
      } else if (this.accounts.length > 0) {
        // Se não há conta ativa válida, usar a primeira
        this.activeAccountId = this.accounts[0].id
        this.saveActiveAccountId()
      }

      console.log(`📦 Carregadas ${this.accounts.length} contas do localStorage`)
    } catch (error) {
      console.error('❌ Erro ao carregar do localStorage:', error)
      this.initializeDefaultAccounts()
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(this.accounts))
      console.log('💾 Contas salvas no localStorage')
    } catch (error) {
      console.error('❌ Erro ao salvar no localStorage:', error)
    }
  }

  private saveActiveAccountId(): void {
    try {
      if (this.activeAccountId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNT_ID, this.activeAccountId)
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ACCOUNT_ID)
      }
    } catch (error) {
      console.error('❌ Erro ao salvar conta ativa:', error)
    }
  }

  private initializeDefaultAccounts(): void {
    console.log('🔧 Inicializando contas padrão')
    
    this.accounts = [
      {
        id: 'account-default-1',
        name: 'Conta Principal',
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'account-default-2',
        name: 'Conta Poupança',
        address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ]

    this.activeAccountId = this.accounts[0].id
    this.saveToStorage()
    this.saveActiveAccountId()
  }

  // ========================================
  // CONNECTION METHODS
  // ========================================
  async connect(): Promise<boolean> {
    try {
      const connected = await this.substrateClient.connect()
      console.log(connected ? '🔗 Conectado com blockchain' : '❌ Falha na conexão')
      return connected
    } catch (error) {
      console.error('❌ Erro na conexão:', error)
      return false
    }
  }

  async disconnect(): Promise<void> {
    await this.substrateClient.disconnect()
    console.log('🔌 Desconectado da blockchain')
  }

  isConnected(): boolean {
    return this.substrateClient.isConnected()
  }

  getNetworkName(): string {
    return 'BazariChain (testnet)'
  }

  // ========================================
  // ACCOUNT MANAGEMENT
  // ========================================
  getAccounts(): WalletAccount[] {
    return this.accounts.map(account => ({
      ...account,
      isActive: account.id === this.activeAccountId
    }))
  }

  getActiveAccount(): WalletAccount | null {
    if (!this.activeAccountId) return null
    
    const account = this.accounts.find(acc => acc.id === this.activeAccountId)
    if (!account) return null

    return {
      ...account,
      isActive: true
    }
  }

  async createAccount(name: string): Promise<WalletAccount> {
    try {
      // Validações
      if (!name.trim()) {
        throw new Error('Nome da conta é obrigatório')
      }

      if (this.accounts.some(acc => acc.name === name.trim())) {
        throw new Error('Já existe uma conta com este nome')
      }

      // Criar nova conta via Substrate client
      const newAccount = await this.substrateClient.createAccount(name.trim())
      
      // Adicionar à lista local
      this.accounts.push(newAccount)
      
      // Se for a primeira conta, torná-la ativa
      if (this.accounts.length === 1) {
        this.activeAccountId = newAccount.id
        this.saveActiveAccountId()
      }

      this.saveToStorage()
      
      console.log('✅ Nova conta criada:', newAccount.name)
      return {
        ...newAccount,
        isActive: newAccount.id === this.activeAccountId
      }

    } catch (error) {
      console.error('❌ Erro ao criar conta:', error)
      throw error
    }
  }

  async renameAccount(accountId: string, newName: string): Promise<boolean> {
    try {
      // Validações
      if (!newName.trim()) {
        throw new Error('Nome não pode estar vazio')
      }

      if (this.accounts.some(acc => acc.id !== accountId && acc.name === newName.trim())) {
        throw new Error('Já existe uma conta com este nome')
      }

      const accountIndex = this.accounts.findIndex(acc => acc.id === accountId)
      if (accountIndex === -1) {
        throw new Error('Conta não encontrada')
      }

      // Atualizar no Substrate client
      await this.substrateClient.renameAccount(accountId, newName.trim())

      // Atualizar localmente
      this.accounts[accountIndex].name = newName.trim()
      this.saveToStorage()

      console.log('✅ Conta renomeada:', newName)
      return true

    } catch (error) {
      console.error('❌ Erro ao renomear conta:', error)
      throw error
    }
  }

  async removeAccount(accountId: string): Promise<boolean> {
    try {
      const accountIndex = this.accounts.findIndex(acc => acc.id === accountId)
      if (accountIndex === -1) {
        throw new Error('Conta não encontrada')
      }

      if (this.accounts.length === 1) {
        throw new Error('Não é possível remover a última conta')
      }

      // Remover do Substrate client
      await this.substrateClient.deleteAccount(accountId)

      // Remover localmente
      const removedAccount = this.accounts[accountIndex]
      this.accounts.splice(accountIndex, 1)

      // Se era a conta ativa, escolher outra
      if (this.activeAccountId === accountId) {
        this.activeAccountId = this.accounts[0].id
        this.saveActiveAccountId()
      }

      this.saveToStorage()

      console.log('✅ Conta removida:', removedAccount.name)
      return true

    } catch (error) {
      console.error('❌ Erro ao remover conta:', error)
      throw error
    }
  }

  setActiveAccount(accountId: string): boolean {
    try {
      const account = this.accounts.find(acc => acc.id === accountId)
      if (!account) {
        throw new Error('Conta não encontrada')
      }

      this.activeAccountId = accountId
      this.saveActiveAccountId()

      console.log('✅ Conta ativa alterada:', account.name)
      return true

    } catch (error) {
      console.error('❌ Erro ao definir conta ativa:', error)
      throw error
    }
  }

  // ========================================
  // BALANCE & TOKENS
  // ========================================
  async getTokenBalances(accountId?: string): Promise<TokenBalance[]> {
    try {
      const targetAccountId = accountId || this.activeAccountId
      if (!targetAccountId) {
        throw new Error('Nenhuma conta ativa')
      }

      const account = this.accounts.find(acc => acc.id === targetAccountId)
      if (!account) {
        throw new Error('Conta não encontrada')
      }

      const balances = await this.substrateClient.getBalance(account.address)
      console.log(`💰 Carregados ${balances.length} tokens para ${account.name}`)
      
      return balances

    } catch (error) {
      console.error('❌ Erro ao carregar saldos:', error)
      throw error
    }
  }

  async searchTokens(query: string, accountId?: string): Promise<TokenBalance[]> {
    const tokens = await this.getTokenBalances(accountId)
    
    if (!query.trim()) return tokens

    const searchQuery = query.toLowerCase()
    return tokens.filter(token =>
      token.symbol.toLowerCase().includes(searchQuery) ||
      token.name.toLowerCase().includes(searchQuery)
    )
  }

  // ========================================
  // NFTs
  // ========================================
  async getNfts(params: PaginationParams, accountId?: string): Promise<PaginatedResult<NftItem>> {
    try {
      const targetAccountId = accountId || this.activeAccountId
      if (!targetAccountId) {
        throw new Error('Nenhuma conta ativa')
      }

      const account = this.accounts.find(acc => acc.id === targetAccountId)
      if (!account) {
        throw new Error('Conta não encontrada')
      }

      const result = await this.substrateClient.getNfts(account.address, params)
      console.log(`🖼️ Carregados ${result.items.length} NFTs (página ${params.page})`)
      
      return result

    } catch (error) {
      console.error('❌ Erro ao carregar NFTs:', error)
      throw error
    }
  }

  async searchNfts(query: string, params: PaginationParams, accountId?: string): Promise<PaginatedResult<NftItem>> {
    return this.getNfts({ ...params, q: query }, accountId)
  }

  // ========================================
  // TRANSACTIONS
  // ========================================
  async getTransactions(params: PaginationParams, accountId?: string): Promise<PaginatedResult<Transaction>> {
    try {
      const targetAccountId = accountId || this.activeAccountId
      if (!targetAccountId) {
        throw new Error('Nenhuma conta ativa')
      }

      const account = this.accounts.find(acc => acc.id === targetAccountId)
      if (!account) {
        throw new Error('Conta não encontrada')
      }

      const result = await this.substrateClient.getTransactions(account.address, params)
      console.log(`📄 Carregadas ${result.items.length} transações (página ${params.page})`)
      
      return result

    } catch (error) {
      console.error('❌ Erro ao carregar transações:', error)
      throw error
    }
  }

  async searchTransactions(query: string, params: PaginationParams, accountId?: string): Promise<PaginatedResult<Transaction>> {
    return this.getTransactions({ ...params, q: query }, accountId)
  }

  // ========================================
  // STAKING
  // ========================================
  async getStakingInfo(accountId?: string) {
    const targetAccountId = accountId || this.activeAccountId
    if (!targetAccountId) return null

    const account = this.accounts.find(acc => acc.id === targetAccountId)
    if (!account) return null

    // Mock: retornar informações de staking fake
    return {
      stakedAmount: '100.0000',
      rewardsEarned: '5.2341',
      unbondingAmount: '0.0000',
      nextUnlockEra: null,
      nominations: [
        {
          validatorAddress: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
          validatorName: 'Validator Alice',
          commission: '5.00%',
          stakedAmount: '100.0000'
        }
      ]
    }
  }

  async stake(amount: string, validatorAddress: string): Promise<string> {
    const activeAccount = this.getActiveAccount()
    if (!activeAccount) {
      throw new Error('Nenhuma conta ativa')
    }

    return this.substrateClient.stake({ amount, validatorAddress })
  }

  async unstake(amount: string): Promise<string> {
    const activeAccount = this.getActiveAccount()
    if (!activeAccount) {
      throw new Error('Nenhuma conta ativa')
    }

    return this.substrateClient.unstake(amount)
  }

  // ========================================
  // PREFERENCES
  // ========================================
  getPreferences(): WalletPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Erro ao carregar preferências:', error)
    }

    // Defaults
    return {
      autoConnect: true,
      showTestNetworks: true,
      defaultGasPrice: '0.001'
    }
  }

  setPreferences(preferences: Partial<WalletPreferences>): void {
    try {
      const current = this.getPreferences()
      const updated = { ...current, ...preferences }
      
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated))
      console.log('✅ Preferências salvas')
    } catch (error) {
      console.error('❌ Erro ao salvar preferências:', error)
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  formatAddress(address: string): string {
    if (!address || address.length < 8) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('❌ Erro ao copiar para clipboard:', error)
      return false
    }
  }

  // ========================================
  // CLEANUP
  // ========================================
  async destroy(): Promise<void> {
    await this.disconnect()
    console.log('🧹 WalletService destruído')
  }
}

// ========================================
// SINGLETON INSTANCE
// ========================================
export const walletService = new WalletService()

// ========================================
// EXPORT TYPES
// ========================================
export type { WalletAccount, TokenBalance, NftItem, Transaction, PaginationParams, PaginatedResult }