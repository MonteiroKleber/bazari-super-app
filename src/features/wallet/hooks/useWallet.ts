// src/features/wallet/hooks/useWallet.ts

/**
 * Hook principal da Wallet - Interface React para gerenciar estado da wallet
 * Gerencia contas, saldos, NFTs, transações e estado de conectividade
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { walletService } from '../services/walletService'
import type { 
  WalletAccount, 
  TokenBalance, 
  NftItem, 
  Transaction, 
  PaginatedResult 
} from '../services/walletService'

// ========================================
// TYPES & INTERFACES
// ========================================
interface WalletState {
  // Connection
  isConnected: boolean
  isConnecting: boolean
  networkLabel: string
  
  // Accounts
  accounts: WalletAccount[]
  activeAccount: WalletAccount | null
  
  // Assets
  tokens: TokenBalance[]
  nfts: NftItem[]
  transactions: Transaction[]
  
  // Pagination state
  hasMoreTokens: boolean
  hasMoreNfts: boolean
  hasMoreTxs: boolean
  
  // Loading states
  isLoadingTokens: boolean
  isLoadingNfts: boolean
  isLoadingTxs: boolean
  
  // Search states
  tokenSearchQuery: string
  nftSearchQuery: string
  txSearchQuery: string
  
  // Error state
  error: string | null
}

interface PaginationState {
  tokens: { page: number; pageSize: number }
  nfts: { page: number; pageSize: number }
  txs: { page: number; pageSize: number }
}

// ========================================
// HOOK IMPLEMENTATION
// ========================================
export const useWallet = () => {
  // ========================================
  // STATE
  // ========================================
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    networkLabel: '',
    accounts: [],
    activeAccount: null,
    tokens: [],
    nfts: [],
    transactions: [],
    hasMoreTokens: false,
    hasMoreNfts: false,
    hasMoreTxs: false,
    isLoadingTokens: false,
    isLoadingNfts: false,
    isLoadingTxs: false,
    tokenSearchQuery: '',
    nftSearchQuery: '',
    txSearchQuery: '',
    error: null,
  })

  const [pagination, setPagination] = useState<PaginationState>({
    tokens: { page: 1, pageSize: 20 },
    nfts: { page: 1, pageSize: 12 },
    txs: { page: 1, pageSize: 15 },
  })

  // Refs para evitar re-renders desnecessários
  const initializationRef = useRef(false)
  const searchTimeoutsRef = useRef<{
    tokens?: NodeJS.Timeout
    nfts?: NodeJS.Timeout
    txs?: NodeJS.Timeout
  }>({})

  // ========================================
  // INITIALIZATION
  // ========================================
  const initialize = useCallback(async () => {
    if (initializationRef.current) return
    initializationRef.current = true

    setState(prev => ({ ...prev, isConnecting: true, error: null }))

    try {
      console.log('🚀 Inicializando wallet...')

      // Conectar com blockchain
      const connected = await walletService.connect()
      
      // Carregar contas
      const accounts = walletService.getAccounts()
      const activeAccount = walletService.getActiveAccount()
      
      setState(prev => ({
        ...prev,
        isConnected: connected,
        isConnecting: false,
        networkLabel: walletService.getNetworkName(),
        accounts,
        activeAccount,
      }))

      // Carregar dados da conta ativa
      if (activeAccount) {
        await Promise.all([
          loadTokens(true),
          loadNfts(true),
          loadTransactions(true),
        ])
      }

      console.log('✅ Wallet inicializada (mock)')

    } catch (error) {
      console.error('❌ Erro na inicialização:', error)
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }))
    }
  }, [])

  // ========================================
  // ACCOUNT MANAGEMENT
  // ========================================
  const createAccount = useCallback(async (name: string): Promise<WalletAccount> => {
    try {
      setState(prev => ({ ...prev, error: null }))
      
      const newAccount = await walletService.createAccount(name)
      const accounts = walletService.getAccounts()
      
      setState(prev => ({ ...prev, accounts }))
      
      return newAccount
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const renameAccount = useCallback(async (accountId: string, newName: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }))
      
      await walletService.renameAccount(accountId, newName)
      const accounts = walletService.getAccounts()
      const activeAccount = walletService.getActiveAccount()
      
      setState(prev => ({ ...prev, accounts, activeAccount }))
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao renomear conta'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const removeAccount = useCallback(async (accountId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }))
      
      await walletService.removeAccount(accountId)
      const accounts = walletService.getAccounts()
      const activeAccount = walletService.getActiveAccount()
      
      setState(prev => ({ ...prev, accounts, activeAccount }))
      
      // Recarregar dados da nova conta ativa
      if (activeAccount) {
        await Promise.all([
          loadTokens(true),
          loadNfts(true), 
          loadTransactions(true),
        ])
      }
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover conta'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const setActiveAccount = useCallback(async (accountId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }))
      
      walletService.setActiveAccount(accountId)
      const accounts = walletService.getAccounts()
      const activeAccount = walletService.getActiveAccount()
      
      setState(prev => ({ ...prev, accounts, activeAccount }))
      
      // Recarregar dados da nova conta ativa
      if (activeAccount) {
        // Reset pagination
        setPagination({
          tokens: { page: 1, pageSize: 20 },
          nfts: { page: 1, pageSize: 12 },
          txs: { page: 1, pageSize: 15 },
        })
        
        await Promise.all([
          loadTokens(true),
          loadNfts(true),
          loadTransactions(true),
        ])
      }
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao definir conta ativa'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  // ========================================
  // TOKEN MANAGEMENT
  // ========================================
  const loadTokens = useCallback(async (reset: boolean = false) => {
    if (!state.activeAccount) return

    setState(prev => ({ ...prev, isLoadingTokens: true, error: null }))

    try {
      const tokens = await walletService.getTokenBalances()
      
      setState(prev => ({
        ...prev,
        tokens,
        isLoadingTokens: false,
        hasMoreTokens: false // Tokens normalmente não são paginados
      }))
    } catch (error) {
      console.error('❌ Erro ao carregar tokens:', error)
      setState(prev => ({
        ...prev,
        isLoadingTokens: false,
        error: 'Erro ao carregar tokens'
      }))
    }
  }, [state.activeAccount])

  const searchTokens = useCallback(async (query: string) => {
    if (!state.activeAccount) return

    // Debounce search
    if (searchTimeoutsRef.current.tokens) {
      clearTimeout(searchTimeoutsRef.current.tokens)
    }

    searchTimeoutsRef.current.tokens = setTimeout(async () => {
      setState(prev => ({ ...prev, tokenSearchQuery: query, isLoadingTokens: true }))

      try {
        const tokens = await walletService.searchTokens(query)
        setState(prev => ({ ...prev, tokens, isLoadingTokens: false }))
      } catch (error) {
        console.error('❌ Erro na busca de tokens:', error)
        setState(prev => ({ ...prev, isLoadingTokens: false, error: 'Erro na busca' }))
      }
    }, 300)
  }, [state.activeAccount])

  // ========================================
  // NFT MANAGEMENT
  // ========================================
  const loadNfts = useCallback(async (reset: boolean = false) => {
    if (!state.activeAccount) return

    const currentPage = reset ? 1 : pagination.nfts.page
    if (reset) {
      setPagination(prev => ({ ...prev, nfts: { ...prev.nfts, page: 1 } }))
    }

    setState(prev => ({ ...prev, isLoadingNfts: true, error: null }))

    try {
      const result = await walletService.getNfts({
        page: currentPage,
        pageSize: pagination.nfts.pageSize,
        q: state.nftSearchQuery || undefined
      })

      setState(prev => ({
        ...prev,
        nfts: reset ? result.items : [...prev.nfts, ...result.items],
        isLoadingNfts: false,
        hasMoreNfts: result.hasMore
      }))

    } catch (error) {
      console.error('❌ Erro ao carregar NFTs:', error)
      setState(prev => ({
        ...prev,
        isLoadingNfts: false,
        error: 'Erro ao carregar NFTs'
      }))
    }
  }, [state.activeAccount, state.nftSearchQuery, pagination.nfts])

  const loadMoreNfts = useCallback(async () => {
    if (state.isLoadingNfts || !state.hasMoreNfts) return

    setPagination(prev => ({
      ...prev,
      nfts: { ...prev.nfts, page: prev.nfts.page + 1 }
    }))

    await loadNfts(false)
  }, [state.isLoadingNfts, state.hasMoreNfts, loadNfts])

  const searchNfts = useCallback(async (query: string) => {
    if (!state.activeAccount) return

    // Debounce search
    if (searchTimeoutsRef.current.nfts) {
      clearTimeout(searchTimeoutsRef.current.nfts)
    }

    searchTimeoutsRef.current.nfts = setTimeout(async () => {
      setState(prev => ({ ...prev, nftSearchQuery: query }))
      setPagination(prev => ({ ...prev, nfts: { ...prev.nfts, page: 1 } }))
      await loadNfts(true)
    }, 300)
  }, [state.activeAccount, loadNfts])

  // ========================================
  // TRANSACTION MANAGEMENT
  // ========================================
  const loadTransactions = useCallback(async (reset: boolean = false) => {
    if (!state.activeAccount) return

    const currentPage = reset ? 1 : pagination.txs.page
    if (reset) {
      setPagination(prev => ({ ...prev, txs: { ...prev.txs, page: 1 } }))
    }

    setState(prev => ({ ...prev, isLoadingTxs: true, error: null }))

    try {
      const result = await walletService.getTransactions({
        page: currentPage,
        pageSize: pagination.txs.pageSize,
        q: state.txSearchQuery || undefined
      })

      setState(prev => ({
        ...prev,
        transactions: reset ? result.items : [...prev.transactions, ...result.items],
        isLoadingTxs: false,
        hasMoreTxs: result.hasMore
      }))

    } catch (error) {
      console.error('❌ Erro ao carregar transações:', error)
      setState(prev => ({
        ...prev,
        isLoadingTxs: false,
        error: 'Erro ao carregar transações'
      }))
    }
  }, [state.activeAccount, state.txSearchQuery, pagination.txs])

  const loadMoreTransactions = useCallback(async () => {
    if (state.isLoadingTxs || !state.hasMoreTxs) return

    setPagination(prev => ({
      ...prev,
      txs: { ...prev.txs, page: prev.txs.page + 1 }
    }))

    await loadTransactions(false)
  }, [state.isLoadingTxs, state.hasMoreTxs, loadTransactions])

  const searchTransactions = useCallback(async (query: string) => {
    if (!state.activeAccount) return

    // Debounce search
    if (searchTimeoutsRef.current.txs) {
      clearTimeout(searchTimeoutsRef.current.txs)
    }

    searchTimeoutsRef.current.txs = setTimeout(async () => {
      setState(prev => ({ ...prev, txSearchQuery: query }))
      setPagination(prev => ({ ...prev, txs: { ...prev.txs, page: 1 } }))
      await loadTransactions(true)
    }, 300)
  }, [state.activeAccount, loadTransactions])

  // ========================================
  // UTILITY METHODS
  // ========================================
  const refreshBalances = useCallback(async () => {
    await loadTokens(true)
  }, [loadTokens])

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    return walletService.copyToClipboard(text)
  }, [])

  const formatAddress = useCallback((address: string): string => {
    return walletService.formatAddress(address)
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // ========================================
  // EFFECTS
  // ========================================
  useEffect(() => {
    initialize()
    
    return () => {
      // Cleanup timeouts
      Object.values(searchTimeoutsRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [initialize])

  // ========================================
  // RETURN HOOK INTERFACE
  // ========================================
  return {
    // State
    ...state,
    
    // Account management
    createAccount,
    renameAccount,
    removeAccount,
    setActiveAccount,
    
    // Token management
    refreshBalances,
    searchTokens,
    
    // NFT management
    loadMoreNfts,
    searchNfts,
    
    // Transaction management
    loadMoreTransactions,
    searchTransactions,
    
    // Utility methods
    copyToClipboard,
    formatAddress,
    clearError,
    
    // Refresh methods
    refreshData: useCallback(async () => {
      if (state.activeAccount) {
        await Promise.all([
          loadTokens(true),
          loadNfts(true),
          loadTransactions(true),
        ])
      }
    }, [state.activeAccount, loadTokens, loadNfts, loadTransactions]),
  }
}

// ========================================
// EXPORT TYPES
// ========================================
export type UseWalletReturn = ReturnType<typeof useWallet>
export type { WalletAccount, TokenBalance, NftItem, Transaction }