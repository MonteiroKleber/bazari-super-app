export interface Wallet {
  id: string
  userId: string
  address: string
  publicKey: string
  
  balances: TokenBalance[]
  
  createdAt: Date
  lastAccessAt: Date
}

export interface TokenBalance {
  tokenId: string
  symbol: string
  name: string
  balance: string
  usdValue?: number
}

export interface Transaction {
  id: string
  hash: string
  walletId: string
  type: 'send' | 'receive' | 'swap'
  status: 'pending' | 'confirmed' | 'failed'
  amount: string
  from: string
  to: string
  timestamp: Date
}
