// src/features/dex/services/dexService.ts

import {
  Pool,
  Position,
  SwapTransaction,
  Token,
  CreatePoolData,
  SwapFormData,
  LiquidityFormData,
  DexStats,
  RewardAccrual,
  NATIVE_TOKENS,
  DEX_CONSTANTS
} from '../types/dex.types'

import {
  calculateInitialLPTokens,
  calculateLPTokens,
  calculateSwapOutput,
  calculateRemoveLiquidity,
  calculatePrice,
  calculateRewards,
  calculateTVL,
  validateSwap
} from '../engine/amm'

/**
 * Serviço DEX - gerencia pools, swaps, liquidez e recompensas
 * Usa localStorage para persistência (mock)
 */
class DexService {
  private readonly STORAGE_KEYS = {
    POOLS: 'dex:pools',
    POSITIONS: 'dex:positions',
    SWAPS: 'dex:swaps',
    REWARDS: 'dex:rewards',
    BALANCES: 'dex:balances' // Mock de saldos de tokens
  } as const

  /**
   * Inicializa dados mockados se não existirem
   */
  private initializeMockData(): void {
    if (!localStorage.getItem(this.STORAGE_KEYS.POOLS)) {
      const mockPools = this.createMockPools()
      localStorage.setItem(this.STORAGE_KEYS.POOLS, JSON.stringify(mockPools))
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.BALANCES)) {
      const mockBalances = this.createMockBalances()
      localStorage.setItem(this.STORAGE_KEYS.BALANCES, JSON.stringify(mockBalances))
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.POSITIONS)) {
      const mockPositions = this.createMockPositions()
      localStorage.setItem(this.STORAGE_KEYS.POSITIONS, JSON.stringify(mockPositions))
    }
  }

  /**
   * Cria pools mock para demonstração
   */
  private createMockPools(): Pool[] {
    const now = Date.now()
    
    // Pool principal BZR-ZARI
    const bzrZariPool: Pool = {
      id: 'pool-bzr-zari',
      tokenA: NATIVE_TOKENS.BZR,
      tokenB: NATIVE_TOKENS.ZARI,
      reserveA: 1000000, // 1M BZR
      reserveB: 250000,  // 250K ZARI (rate 1 ZARI = 4 BZR)
      lpToken: {
        id: 'lp-bzr-zari',
        symbol: 'BZR-ZARI LP',
        name: 'BZR-ZARI Liquidity Token',
        decimals: 8,
        type: 'lp_token'
      },
      totalLpSupply: 500000, // sqrt(1000000 * 250000)
      swapFee: 0.003, // 0.3%
      protocolFee: 0.0005, // 0.05%
      rewardToken: NATIVE_TOKENS.ZARI,
      rewardRate: 10, // 10 ZARI por minuto
      volume24h: 150000,
      tvl: 2000000, // Valor em BZR
      apr: 45.2,
      createdAt: now - 86400000 * 30, // 30 dias atrás
      lastUpdatedAt: now
    }

    return [bzrZariPool]
  }

  /**
   * Cria saldos mock de tokens para usuários
   */
  private createMockBalances(): Record<string, Record<string, number>> {
    return {
      '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY': {
        'BZR': 50000,
        'ZARI': 12500,
        'BZR-ZARI LP': 1250
      },
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty': {
        'BZR': 35000,
        'ZARI': 8750,
        'BZR-ZARI LP': 875
      },
      '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y': {
        'BZR': 25000,
        'ZARI': 6250,
        'BZR-ZARI LP': 625
      }
    }
  }

  /**
   * Cria posições mock de liquidez
   */
  private createMockPositions(): Position[] {
    const now = Date.now()
    
    return [
      {
        id: 'pos-001',
        poolId: 'pool-bzr-zari',
        user: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        lpBalance: 1250,
        sharePercentage: 0.25, // 0.25% do pool
        tokenAAmount: 2500, // Proporção em BZR
        tokenBAmount: 625,  // Proporção em ZARI
        pendingRewards: 145.5,
        claimedRewards: 890.2,
        lastClaimAt: now - 3600000, // 1 hora atrás
        addedAt: now - 86400000 * 7, // 7 dias atrás
        lastUpdatedAt: now
      },
      {
        id: 'pos-002',
        poolId: 'pool-bzr-zari',
        user: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        lpBalance: 875,
        sharePercentage: 0.175,
        tokenAAmount: 1750,
        tokenBAmount: 437.5,
        pendingRewards: 98.3,
        claimedRewards: 623.1,
        lastClaimAt: now - 7200000, // 2 horas atrás
        addedAt: now - 86400000 * 5, // 5 dias atrás
        lastUpdatedAt: now
      }
    ]
  }

  /**
   * Busca todos os pools
   */
  async getPools(): Promise<Pool[]> {
    this.initializeMockData()
    const stored = localStorage.getItem(this.STORAGE_KEYS.POOLS)
    const pools = stored ? JSON.parse(stored) : []
    
    // Atualizar dados dos pools (preços, rewards, etc.)
    return pools.map((pool: Pool) => this.updatePoolData(pool))
  }

  /**
   * Busca pool por ID
   */
  async getPool(id: string): Promise<Pool | null> {
    const pools = await this.getPools()
    return pools.find(p => p.id === id) || null
  }

  /**
   * Busca pool por par de tokens
   */
  async getPoolByTokens(tokenA: string, tokenB: string): Promise<Pool | null> {
    const pools = await this.getPools()
    return pools.find(p => 
      (p.tokenA.id === tokenA && p.tokenB.id === tokenB) ||
      (p.tokenA.id === tokenB && p.tokenB.id === tokenA)
    ) || null
  }

  /**
   * Cria novo pool
   */
  async createPool(data: CreatePoolData, creator: string): Promise<string> {
    // Verificar se pool já existe
    const existingPool = await this.getPoolByTokens(data.tokenA, data.tokenB)
    if (existingPool) {
      throw new Error('Pool already exists for this token pair')
    }

    // Verificar saldos do usuário
    const userBalances = this.getUserBalances(creator)
    if ((userBalances[data.tokenA] || 0) < data.amountA) {
      throw new Error(`Insufficient ${data.tokenA} balance`)
    }
    if ((userBalances[data.tokenB] || 0) < data.amountB) {
      throw new Error(`Insufficient ${data.tokenB} balance`)
    }

    // Verificar liquidez mínima
    const totalValue = data.amountA + data.amountB // Simplificado
    if (totalValue < DEX_CONSTANTS.MIN_POOL_SIZE) {
      throw new Error(`Minimum pool size is ${DEX_CONSTANTS.MIN_POOL_SIZE}`)
    }

    const poolId = `pool-${data.tokenA.toLowerCase()}-${data.tokenB.toLowerCase()}`
    const lpTokenId = `lp-${data.tokenA.toLowerCase()}-${data.tokenB.toLowerCase()}`
    
    // Calcular LP tokens iniciais
    const initialLPTokens = calculateInitialLPTokens(data.amountA, data.amountB)
    
    const newPool: Pool = {
      id: poolId,
      tokenA: this.getTokenById(data.tokenA)!,
      tokenB: this.getTokenById(data.tokenB)!,
      reserveA: data.amountA,
      reserveB: data.amountB,
      lpToken: {
        id: lpTokenId,
        symbol: `${data.tokenA}-${data.tokenB} LP`,
        name: `${data.tokenA}-${data.tokenB} Liquidity Token`,
        decimals: 8,
        type: 'lp_token'
      },
      totalLpSupply: initialLPTokens,
      swapFee: data.swapFee || DEX_CONSTANTS.DEFAULT_SWAP_FEE,
      protocolFee: DEX_CONSTANTS.DEFAULT_PROTOCOL_FEE,
      rewardToken: NATIVE_TOKENS.ZARI,
      rewardRate: data.rewardRate || 5, // 5 ZARI por minuto por padrão
      volume24h: 0,
      tvl: totalValue,
      apr: 0,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now()
    }

    // Salvar pool
    const pools = await this.getPools()
    pools.push(newPool)
    localStorage.setItem(this.STORAGE_KEYS.POOLS, JSON.stringify(pools))

    // Criar posição inicial para o criador
    await this.createInitialPosition(poolId, creator, initialLPTokens, data.amountA, data.amountB)

    // Debitar tokens do usuário
    this.updateUserBalance(creator, data.tokenA, -data.amountA)
    this.updateUserBalance(creator, data.tokenB, -data.amountB)
    this.updateUserBalance(creator, lpTokenId, initialLPTokens)

    return poolId
  }

  /**
   * Adiciona liquidez a um pool
   */
  async addLiquidity(poolId: string, user: string, amountA: number, amountB: number): Promise<void> {
    const pool = await this.getPool(poolId)
    if (!pool) {
      throw new Error('Pool not found')
    }

    // Verificar saldos
    const userBalances = this.getUserBalances(user)
    if ((userBalances[pool.tokenA.id] || 0) < amountA) {
      throw new Error(`Insufficient ${pool.tokenA.symbol} balance`)
    }
    if ((userBalances[pool.tokenB.id] || 0) < amountB) {
      throw new Error(`Insufficient ${pool.tokenB.symbol} balance`)
    }

    // Calcular LP tokens a receber
    const lpTokens = calculateLPTokens(amountA, amountB, pool.reserveA, pool.reserveB, pool.totalLpSupply)
    
    // Atualizar pool
    pool.reserveA += amountA
    pool.reserveB += amountB
    pool.totalLpSupply += lpTokens
    pool.lastUpdatedAt = Date.now()

    // Salvar pool atualizado
    const pools = await this.getPools()
    const poolIndex = pools.findIndex(p => p.id === poolId)
    if (poolIndex !== -1) {
      pools[poolIndex] = pool
      localStorage.setItem(this.STORAGE_KEYS.POOLS, JSON.stringify(pools))
    }

    // Atualizar ou criar posição
    await this.updateUserPosition(poolId, user, lpTokens, amountA, amountB, 'add')

    // Atualizar saldos do usuário
    this.updateUserBalance(user, pool.tokenA.id, -amountA)
    this.updateUserBalance(user, pool.tokenB.id, -amountB)
    this.updateUserBalance(user, pool.lpToken.id, lpTokens)
  }

  /**
   * Remove liquidez de um pool
   */
  async removeLiquidity(poolId: string, user: string, lpAmount: number): Promise<void> {
    const pool = await this.getPool(poolId)
    if (!pool) {
      throw new Error('Pool not found')
    }

    // Verificar saldo de LP tokens
    const userBalances = this.getUserBalances(user)
    if ((userBalances[pool.lpToken.id] || 0) < lpAmount) {
      throw new Error('Insufficient LP token balance')
    }

    // Calcular tokens a receber
    const { amountA, amountB } = calculateRemoveLiquidity(lpAmount, pool.totalLpSupply, pool.reserveA, pool.reserveB)

    // Atualizar pool
    pool.reserveA -= amountA
    pool.reserveB -= amountB
    pool.totalLpSupply -= lpAmount
    pool.lastUpdatedAt = Date.now()

    // Salvar pool atualizado
    const pools = await this.getPools()
    const poolIndex = pools.findIndex(p => p.id === poolId)
    if (poolIndex !== -1) {
      pools[poolIndex] = pool
      localStorage.setItem(this.STORAGE_KEYS.POOLS, JSON.stringify(pools))
    }

    // Atualizar posição
    await this.updateUserPosition(poolId, user, -lpAmount, -amountA, -amountB, 'remove')

    // Atualizar saldos do usuário
    this.updateUserBalance(user, pool.tokenA.id, amountA)
    this.updateUserBalance(user, pool.tokenB.id, amountB)
    this.updateUserBalance(user, pool.lpToken.id, -lpAmount)
  }

  /**
   * Realiza swap entre tokens
   */
  async swap(poolId: string, user: string, tokenIn: string, amountIn: number, minAmountOut: number): Promise<void> {
    const pool = await this.getPool(poolId)
    if (!pool) {
      throw new Error('Pool not found')
    }

    // Verificar saldo do usuário
    const userBalances = this.getUserBalances(user)
    if ((userBalances[tokenIn] || 0) < amountIn) {
      throw new Error(`Insufficient ${tokenIn} balance`)
    }

    // Determinar direção do swap
    const isTokenAIn = pool.tokenA.id === tokenIn
    const tokenOut = isTokenAIn ? pool.tokenB.id : pool.tokenA.id
    const reserveIn = isTokenAIn ? pool.reserveA : pool.reserveB
    const reserveOut = isTokenAIn ? pool.reserveB : pool.reserveA

    // Validar swap
    const validation = validateSwap(amountIn, reserveIn, reserveOut)
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '))
    }

    // Calcular output
    const { amountOut, priceImpact } = calculateSwapOutput(amountIn, reserveIn, reserveOut, pool.swapFee)
    
    if (amountOut < minAmountOut) {
      throw new Error(`Output amount ${amountOut} is less than minimum required ${minAmountOut}`)
    }

    // Atualizar reservas do pool
    if (isTokenAIn) {
      pool.reserveA += amountIn
      pool.reserveB -= amountOut
    } else {
      pool.reserveB += amountIn
      pool.reserveA -= amountOut
    }

    // Atualizar volume
    pool.volume24h += amountIn // Simplificado
    pool.lastUpdatedAt = Date.now()

    // Salvar pool atualizado
    const pools = await this.getPools()
    const poolIndex = pools.findIndex(p => p.id === poolId)
    if (poolIndex !== -1) {
      pools[poolIndex] = pool
      localStorage.setItem(this.STORAGE_KEYS.POOLS, JSON.stringify(pools))
    }

    // Registrar transação de swap
    const swapTx: SwapTransaction = {
      id: `swap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      poolId,
      user,
      tokenIn: this.getTokenById(tokenIn)!,
      tokenOut: this.getTokenById(tokenOut)!,
      amountIn,
      amountOut,
      priceImpact,
      slippage: (minAmountOut - amountOut) / minAmountOut,
      rate: amountOut / amountIn,
      swapFee: amountIn * pool.swapFee,
      protocolFee: amountIn * pool.protocolFee,
      timestamp: Date.now()
    }

    const swaps = this.getSwapHistory()
    swaps.push(swapTx)
    localStorage.setItem(this.STORAGE_KEYS.SWAPS, JSON.stringify(swaps))

    // Atualizar saldos do usuário
    this.updateUserBalance(user, tokenIn, -amountIn)
    this.updateUserBalance(user, tokenOut, amountOut)
  }

  /**
   * Claim recompensas de um pool
   */
  async claimRewards(poolId: string, user: string): Promise<number> {
    const position = await this.getUserPosition(poolId, user)
    if (!position) {
      throw new Error('No position found for this pool')
    }

    if (position.pendingRewards <= 0) {
      throw new Error('No rewards to claim')
    }

    const rewardsAmount = position.pendingRewards

    // Atualizar posição
    position.claimedRewards += rewardsAmount
    position.pendingRewards = 0
    position.lastClaimAt = Date.now()
    position.lastUpdatedAt = Date.now()

    // Salvar posição atualizada
    const positions = await this.getUserPositions(user)
    const positionIndex = positions.findIndex(p => p.id === position.id)
    if (positionIndex !== -1) {
      positions[positionIndex] = position
      this.savePositions(positions)
    }

    // Creditar ZARI ao usuário
    this.updateUserBalance(user, 'ZARI', rewardsAmount)

    return rewardsAmount
  }

  /**
   * Busca posições de um usuário
   */
  async getUserPositions(user: string): Promise<Position[]> {
    this.initializeMockData()
    const stored = localStorage.getItem(this.STORAGE_KEYS.POSITIONS)
    const positions: Position[] = stored ? JSON.parse(stored) : []
    
    return positions
      .filter(p => p.user === user)
      .map(p => this.updatePositionRewards(p))
  }

  /**
   * Busca posição específica do usuário em um pool
   */
  async getUserPosition(poolId: string, user: string): Promise<Position | null> {
    const positions = await this.getUserPositions(user)
    return positions.find(p => p.poolId === poolId) || null
  }

  /**
   * Busca histórico de swaps
   */
  getSwapHistory(): SwapTransaction[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.SWAPS)
    return stored ? JSON.parse(stored) : []
  }

  /**
   * Busca estatísticas gerais do DEX
   */
  async getDexStats(): Promise<DexStats> {
    const pools = await this.getPools()
    const swaps = this.getSwapHistory()
    
    const totalTVL = pools.reduce((sum, pool) => sum + pool.tvl, 0)
    const volume24h = pools.reduce((sum, pool) => sum + pool.volume24h, 0)
    const totalUsers = new Set(swaps.map(s => s.user)).size
    const totalFees = swaps.reduce((sum, swap) => sum + swap.swapFee, 0)

    return {
      totalTVL,
      volume24h,
      totalPools: pools.length,
      totalUsers,
      totalSwaps: swaps.length,
      totalFees
    }
  }

  // Métodos privados auxiliares

  private getTokenById(id: string): Token | null {
    return Object.values(NATIVE_TOKENS).find(token => token.id === id) || null
  }

  private getUserBalances(user: string): Record<string, number> {
    const balances = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BALANCES) || '{}')
    return balances[user] || {}
  }

  private updateUserBalance(user: string, token: string, amount: number): void {
    const allBalances = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.BALANCES) || '{}')
    
    if (!allBalances[user]) {
      allBalances[user] = {}
    }
    
    allBalances[user][token] = (allBalances[user][token] || 0) + amount
    
    // Não permitir saldos negativos
    if (allBalances[user][token] < 0) {
      allBalances[user][token] = 0
    }
    
    localStorage.setItem(this.STORAGE_KEYS.BALANCES, JSON.stringify(allBalances))
  }

  private async createInitialPosition(poolId: string, user: string, lpTokens: number, amountA: number, amountB: number): Promise<void> {
    const position: Position = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      poolId,
      user,
      lpBalance: lpTokens,
      sharePercentage: 100, // 100% do pool inicialmente
      tokenAAmount: amountA,
      tokenBAmount: amountB,
      pendingRewards: 0,
      claimedRewards: 0,
      lastClaimAt: Date.now(),
      addedAt: Date.now(),
      lastUpdatedAt: Date.now()
    }

    const positions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.POSITIONS) || '[]')
    positions.push(position)
    localStorage.setItem(this.STORAGE_KEYS.POSITIONS, JSON.stringify(positions))
  }

  private async updateUserPosition(poolId: string, user: string, lpDelta: number, amountADelta: number, amountBDelta: number, operation: 'add' | 'remove'): Promise<void> {
    const positions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.POSITIONS) || '[]')
    const positionIndex = positions.findIndex((p: Position) => p.poolId === poolId && p.user === user)

    if (positionIndex === -1 && operation === 'add') {
      // Criar nova posição
      const newPosition: Position = {
        id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        poolId,
        user,
        lpBalance: lpDelta,
        sharePercentage: 0, // Será calculado no updatePoolData
        tokenAAmount: amountADelta,
        tokenBAmount: amountBDelta,
        pendingRewards: 0,
        claimedRewards: 0,
        lastClaimAt: Date.now(),
        addedAt: Date.now(),
        lastUpdatedAt: Date.now()
      }
      positions.push(newPosition)
    } else if (positionIndex !== -1) {
      // Atualizar posição existente
      positions[positionIndex].lpBalance += lpDelta
      positions[positionIndex].tokenAAmount += amountADelta
      positions[positionIndex].tokenBAmount += amountBDelta
      positions[positionIndex].lastUpdatedAt = Date.now()

      // Remover posição se saldo zerou
      if (positions[positionIndex].lpBalance <= 0) {
        positions.splice(positionIndex, 1)
      }
    }

    localStorage.setItem(this.STORAGE_KEYS.POSITIONS, JSON.stringify(positions))
  }

  private savePositions(positions: Position[]): void {
    localStorage.setItem(this.STORAGE_KEYS.POSITIONS, JSON.stringify(positions))
  }

  private updatePoolData(pool: Pool): Pool {
    // Atualizar preços
    const { priceAInB } = calculatePrice(pool.reserveA, pool.reserveB)
    
    // Atualizar TVL (simplificado)
    pool.tvl = calculateTVL(pool.reserveA, pool.reserveB, 1, priceAInB)
    
    // Calcular APR baseado nas recompensas
    if (pool.tvl > 0) {
      const yearlyRewards = pool.rewardRate * DEX_CONSTANTS.MINUTES_PER_DAY * DEX_CONSTANTS.DAYS_PER_YEAR
      pool.apr = (yearlyRewards * priceAInB / pool.tvl) * 100
    }

    return pool
  }

  private updatePositionRewards(position: Position): Position {
    const now = Date.now()
    const timeElapsedMinutes = (now - position.lastClaimAt) / (1000 * 60)
    
    // Buscar pool para pegar reward rate
    const pools = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.POOLS) || '[]')
    const pool = pools.find((p: Pool) => p.id === position.poolId)
    
    if (pool && timeElapsedMinutes > 0) {
      const newRewards = calculateRewards(position.lpBalance, pool.totalLpSupply, pool.rewardRate, timeElapsedMinutes)
      position.pendingRewards += newRewards
    }

    // Calcular share percentage
    if (pool) {
      position.sharePercentage = (position.lpBalance / pool.totalLpSupply) * 100
    }

    return position
  }
}

export const dexService = new DexService()