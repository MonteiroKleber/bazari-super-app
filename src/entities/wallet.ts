export interface Wallet {
  id: string
  userId: string
  address: string
  publicKey: string
  encryptedPrivateKey: string
  
  balances: TokenBalance[]
  settings: WalletSettings
  
  createdAt: Date
  lastAccessAt: Date
}

export interface TokenBalance {
  tokenId: string
  symbol: string
  name: string
  decimals: number
  balance: string
  usdValue?: number
  
  logoUrl?: string
  isNative: boolean
  contractAddress?: string
}

export interface WalletSettings {
  defaultCurrency: string
  showBalanceInUSD: boolean
  autoLockTimeout: number
  biometricEnabled: boolean
  notifications: {
    transactions: boolean
    priceAlerts: boolean
    governance: boolean
  }
}

export interface Transaction {
  id: string
  hash: string
  walletId: string
  
  type: TransactionType
  status: TransactionStatus
  amount: string
  tokenId: string
  
  from: string
  to: string
  
  blockNumber?: number
  gasUsed?: string
  gasPrice?: string
  fee?: string
  
  description?: string
  metadata?: Record<string, any>
  
  timestamp: Date
  confirmedAt?: Date
}

export type TransactionType = 
  | 'send'
  | 'receive'
  | 'swap'
  | 'stake'
  | 'unstake'
  | 'nft_transfer'
  | 'governance_vote'
  | 'marketplace_purchase'
  | 'marketplace_sale'

export type TransactionStatus = 
  | 'pending'
  | 'confirmed'
  | 'failed'
  | 'cancelled'
