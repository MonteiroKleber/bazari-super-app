// src/features/dex/types/dex.types.ts

export enum TokenType {
  NATIVE = 'native',
  GOVERNANCE = 'governance',
  LP_TOKEN = 'lp_token'
}

export interface Token {
  id: string
  symbol: string
  name: string
  decimals: number
  type: TokenType
  totalSupply?: number
  logo?: string
}

export interface Pool {
  id: string
  tokenA: Token
  tokenB: Token
  
  // Reserves (quantidade de cada token no pool)
  reserveA: number
  reserveB: number
  
  // LP Token info
  lpToken: Token
  totalLpSupply: number
  
  // Fees
  swapFee: number // ex: 0.003 = 0.3%
  protocolFee: number // ex: 0.0005 = 0.05%
  
  // Rewards
  rewardToken: Token
  rewardRate: number // tokens por minuto
  
  // Stats
  volume24h: number
  tvl: number // Total Value Locked
  apr: number // Annual Percentage Rate
  
  // Timestamps
  createdAt: number
  lastUpdatedAt: number
}

export interface Position {
  id: string
  poolId: string
  user: string
  
  // LP holdings
  lpBalance: number
  sharePercentage: number
  
  // Underlying tokens
  tokenAAmount: number
  tokenBAmount: number
  
  // Rewards
  pendingRewards: number
  claimedRewards: number
  lastClaimAt: number
  
  // Timestamps
  addedAt: number
  lastUpdatedAt: number
}

export interface SwapTransaction {
  id: string
  poolId: string
  user: string
  
  // Swap details
  tokenIn: Token
  tokenOut: Token
  amountIn: number
  amountOut: number
  
  // Pricing
  priceImpact: number
  slippage: number
  rate: number // exchange rate
  
  // Fees
  swapFee: number
  protocolFee: number
  
  // Timestamps
  timestamp: number
  txHash?: string
}

export interface RewardAccrual {
  id: string
  poolId: string
  user: string
  amount: number
  period: {
    start: number
    end: number
  }
  claimed: boolean
  claimedAt?: number
}

export interface LiquidityOperation {
  id: string
  poolId: string
  user: string
  type: 'add' | 'remove'
  
  // Amounts
  tokenAAmount: number
  tokenBAmount: number
  lpTokens: number
  
  // Share info
  shareAdded: number // percentual do pool
  
  timestamp: number
  txHash?: string
}

// Interfaces para cálculos AMM
export interface SwapCalculation {
  amountOut: number
  priceImpact: number
  slippage: number
  fee: number
  protocolFee: number
  minimumReceived: number
  rate: number
}

export interface LiquidityCalculation {
  lpTokens: number
  sharePercentage: number
  tokenARequired: number
  tokenBRequired: number
  priceA: number
  priceB: number
}

export interface RemoveLiquidityCalculation {
  tokenAAmount: number
  tokenBAmount: number
  shareRemoved: number
}

// Estatísticas do DEX
export interface DexStats {
  totalTVL: number
  volume24h: number
  totalPools: number
  totalUsers: number
  totalSwaps: number
  totalFees: number
}

export interface PoolStats {
  volume24h: number
  volume7d: number
  volume30d: number
  fees24h: number
  apr: number
  priceChange24h: number
  liquidityProviders: number
}

// Constantes do DEX
export const DEX_CONSTANTS = {
  DEFAULT_SWAP_FEE: 0.003, // 0.3%
  DEFAULT_PROTOCOL_FEE: 0.0005, // 0.05%
  MIN_LIQUIDITY: 1000, // Mínimo de liquidez inicial
  MAX_SLIPPAGE: 0.5, // 50% slippage máximo
  DEFAULT_SLIPPAGE: 0.005, // 0.5% slippage padrão
  REWARD_PRECISION: 8, // Casas decimais para recompensas
  LP_FEE_SPLIT: 0.83, // 83% das taxas para LPs, 17% protocolo
  MIN_POOL_SIZE: 100, // Valor mínimo para criar pool
  MAX_POOLS_PER_TOKEN: 10, // Máximo de pools por token
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_DAY: 1440,
  DAYS_PER_YEAR: 365
} as const

// Tokens nativos da BazariChain
export const NATIVE_TOKENS: Record<string, Token> = {
  BZR: {
    id: 'bzr',
    symbol: 'BZR',
    name: 'Bazari Token',
    decimals: 8,
    type: TokenType.NATIVE,
    totalSupply: 1000000000, // 1 bilhão
    logo: '/tokens/bzr.png'
  },
  ZARI: {
    id: 'zari',
    symbol: 'ZARI',
    name: 'Bazari Governance',
    decimals: 8,
    type: TokenType.GOVERNANCE,
    totalSupply: 100000000, // 100 milhões
    logo: '/tokens/zari.png'
  }
} as const

// Interface para hooks
export interface UseDEXReturn {
  // State
  pools: Pool[]
  positions: Position[]
  swapHistory: SwapTransaction[]
  stats: DexStats
  loading: boolean
  error: string | null
  
  // Pool operations
  createPool: (tokenA: string, tokenB: string, initialA: number, initialB: number) => Promise<string>
  addLiquidity: (poolId: string, amountA: number, amountB: number) => Promise<void>
  removeLiquidity: (poolId: string, lpAmount: number) => Promise<void>
  
  // Swap operations
  swap: (poolId: string, tokenIn: string, amountIn: number, minAmountOut: number) => Promise<void>
  
  // Rewards
  claimRewards: (poolId: string) => Promise<void>
  claimAllRewards: () => Promise<void>
  
  // Calculations
  calculateSwap: (poolId: string, tokenIn: string, amountIn: number) => SwapCalculation | null
  calculateAddLiquidity: (poolId: string, amountA: number) => LiquidityCalculation | null
  calculateRemoveLiquidity: (poolId: string, lpAmount: number) => RemoveLiquidityCalculation | null
  
  // Queries
  getPool: (id: string) => Pool | undefined
  getPoolByTokens: (tokenA: string, tokenB: string) => Pool | undefined
  getUserPositions: (address: string) => Position[]
  getPoolStats: (poolId: string) => PoolStats | null
}

export interface CreatePoolData {
  tokenA: string
  tokenB: string
  amountA: number
  amountB: number
  swapFee?: number
  rewardRate?: number
}

export interface SwapFormData {
  tokenIn: string
  tokenOut: string
  amountIn: number
  slippageTolerance: number
  deadline?: number
}

export interface LiquidityFormData {
  poolId: string
  amountA: number
  amountB: number
  slippageTolerance: number
  deadline?: number
}