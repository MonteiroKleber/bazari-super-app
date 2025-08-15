// src/features/dex/hooks/useDEX.ts

import { useState, useEffect, useCallback } from 'react'
import {
  Pool,
  Position,
  SwapTransaction,
  DexStats,
  PoolStats,
  CreatePoolData,
  SwapCalculation,
  LiquidityCalculation,
  RemoveLiquidityCalculation,
  UseDEXReturn
} from '../types/dex.types'
import { dexService } from '../services/dexService'
import {
  calculateSwapOutput,
  calculateLPTokens,
  calculateProportionalAmounts,
  calculateRemoveLiquidity,
  calculateMinimumAmountOut,
  calculatePrice
} from '../engine/amm'

/**
 * Hook principal para gerenciar estado e ações do DEX
 */
export const useDEX = (): UseDEXReturn => {
  const [pools, setPools] = useState<Pool[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [swapHistory, setSwapHistory] = useState<SwapTransaction[]>([])
  const [stats, setStats] = useState<DexStats>({
    totalTVL: 0,
    volume24h: 0,
    totalPools: 0,
    totalUsers: 0,
    totalSwaps: 0,
    totalFees: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Carrega dados iniciais do DEX
   */
  const loadDEXData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com wallet para obter endereço do usuário
      const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

      const [poolsData, positionsData, swapHistoryData, statsData] = await Promise.all([
        dexService.getPools(),
        dexService.getUserPositions(mockUserAddress),
        Promise.resolve(dexService.getSwapHistory()),
        dexService.getDexStats()
      ])

      setPools(poolsData)
      setPositions(positionsData)
      setSwapHistory(swapHistoryData)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load DEX data')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Cria novo pool
   */
  const createPool = useCallback(async (
    tokenA: string, 
    tokenB: string, 
    initialA: number, 
    initialB: number
  ): Promise<string> => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com wallet para obter endereço do usuário
      const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

      const poolData: CreatePoolData = {
        tokenA,
        tokenB,
        amountA: initialA,
        amountB: initialB
      }

      const poolId = await dexService.createPool(poolData, mockUserAddress)
      
      // Recarregar dados
      await loadDEXData()
      
      return poolId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create pool'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDEXData])

  /**
   * Adiciona liquidez a um pool
   */
  const addLiquidity = useCallback(async (
    poolId: string, 
    amountA: number, 
    amountB: number
  ): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com wallet para obter endereço do usuário
      const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

      await dexService.addLiquidity(poolId, mockUserAddress, amountA, amountB)
      
      // Recarregar dados
      await loadDEXData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add liquidity'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDEXData])

  /**
   * Remove liquidez de um pool
   */
  const removeLiquidity = useCallback(async (
    poolId: string, 
    lpAmount: number
  ): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com wallet para obter endereço do usuário
      const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

      await dexService.removeLiquidity(poolId, mockUserAddress, lpAmount)
      
      // Recarregar dados
      await loadDEXData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove liquidity'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDEXData])

  /**
   * Realiza swap entre tokens
   */
  const swap = useCallback(async (
    poolId: string, 
    tokenIn: string, 
    amountIn: number, 
    minAmountOut: number
  ): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com wallet para obter endereço do usuário
      const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

      await dexService.swap(poolId, mockUserAddress, tokenIn, amountIn, minAmountOut)
      
      // Recarregar dados
      await loadDEXData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute swap'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDEXData])

  /**
   * Claim recompensas de um pool específico
   */
  const claimRewards = useCallback(async (poolId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com wallet para obter endereço do usuário
      const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

      await dexService.claimRewards(poolId, mockUserAddress)
      
      // Recarregar dados
      await loadDEXData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim rewards'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDEXData])

  /**
   * Claim todas as recompensas pendentes
   */
  const claimAllRewards = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Claim de todos os pools com recompensas pendentes
      const positionsWithRewards = positions.filter(p => p.pendingRewards > 0)
      
      for (const position of positionsWithRewards) {
        await claimRewards(position.poolId)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim all rewards'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [positions, claimRewards])

  /**
   * Calcula output de um swap
   */
  const calculateSwap = useCallback((
    poolId: string, 
    tokenIn: string, 
    amountIn: number
  ): SwapCalculation | null => {
    if (!poolId || !tokenIn || amountIn <= 0) return null

    const pool = pools.find(p => p.id === poolId)
    if (!pool) return null

    try {
      const isTokenAIn = pool.tokenA.id === tokenIn
      const reserveIn = isTokenAIn ? pool.reserveA : pool.reserveB
      const reserveOut = isTokenAIn ? pool.reserveB : pool.reserveA

      const { amountOut, priceImpact, effectivePrice } = calculateSwapOutput(
        amountIn, 
        reserveIn, 
        reserveOut, 
        pool.swapFee
      )

      const fee = amountIn * pool.swapFee
      const protocolFee = amountIn * pool.protocolFee
      const slippage = 0.005 // Default 0.5%
      const minimumReceived = calculateMinimumAmountOut(amountOut, slippage)

      return {
        amountOut,
        priceImpact,
        slippage,
        fee,
        protocolFee,
        minimumReceived,
        rate: effectivePrice
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating swap')
      return null
    }
  }, [pools])

  /**
   * Calcula liquidez a ser adicionada
   */
  const calculateAddLiquidity = useCallback((
    poolId: string, 
    amountA: number
  ): LiquidityCalculation | null => {
    if (!poolId || amountA <= 0) return null

    const pool = pools.find(p => p.id === poolId)
    if (!pool) return null

    try {
      const { amountB } = calculateProportionalAmounts(
        amountA, 
        true, 
        pool.reserveA, 
        pool.reserveB
      )

      const lpTokens = calculateLPTokens(
        amountA, 
        amountB, 
        pool.reserveA, 
        pool.reserveB, 
        pool.totalLpSupply
      )

      const sharePercentage = (lpTokens / (pool.totalLpSupply + lpTokens)) * 100
      const { priceAInB, priceBInA } = calculatePrice(pool.reserveA, pool.reserveB)

      return {
        lpTokens,
        sharePercentage,
        tokenARequired: amountA,
        tokenBRequired: amountB,
        priceA: priceBInA,
        priceB: priceAInB
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating liquidity')
      return null
    }
  }, [pools])

  /**
   * Calcula tokens recebidos ao remover liquidez
   */
  const calculateRemoveLiquidity = useCallback((
    poolId: string, 
    lpAmount: number
  ): RemoveLiquidityCalculation | null => {
    if (!poolId || lpAmount <= 0) return null

    const pool = pools.find(p => p.id === poolId)
    if (!pool) return null

    try {
      const result = calculateRemoveLiquidity(
        lpAmount, 
        pool.totalLpSupply, 
        pool.reserveA, 
        pool.reserveB
      )

      return {
        tokenAAmount: result.amountA,
        tokenBAmount: result.amountB,
        shareRemoved: result.shareRemoved
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating liquidity removal')
      return null
    }
  }, [pools])

  /**
   * Busca pool por ID
   */
  const getPool = useCallback((id: string): Pool | undefined => {
    return pools.find(p => p.id === id)
  }, [pools])

  /**
   * Busca pool por par de tokens
   */
  const getPoolByTokens = useCallback((tokenA: string, tokenB: string): Pool | undefined => {
    return pools.find(p => 
      (p.tokenA.id === tokenA && p.tokenB.id === tokenB) ||
      (p.tokenA.id === tokenB && p.tokenB.id === tokenA)
    )
  }, [pools])

  /**
   * Busca posições do usuário
   */
  const getUserPositions = useCallback((address: string): Position[] => {
    return positions.filter(p => p.user === address)
  }, [positions])

  /**
   * Busca estatísticas de um pool
   */
  const getPoolStats = useCallback((poolId: string): PoolStats | null => {
    const pool = pools.find(p => p.id === poolId)
    if (!pool) return null

    // Mock stats - em implementação real viria do backend
    return {
      volume24h: pool.volume24h,
      volume7d: pool.volume24h * 7,
      volume30d: pool.volume24h * 30,
      fees24h: pool.volume24h * pool.swapFee,
      apr: pool.apr,
      priceChange24h: Math.random() * 20 - 10, // -10% a +10%
      liquidityProviders: positions.filter(p => p.poolId === poolId).length
    }
  }, [pools, positions])

  // Carrega dados na inicialização
  useEffect(() => {
    loadDEXData()
  }, [loadDEXData])

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadDEXData()
    }, 30000)

    return () => clearInterval(interval)
  }, [loadDEXData])

  return {
    // State
    pools,
    positions,
    swapHistory,
    stats,
    loading,
    error,
    
    // Pool operations
    createPool,
    addLiquidity,
    removeLiquidity,
    
    // Swap operations
    swap,
    
    // Rewards
    claimRewards,
    claimAllRewards,
    
    // Calculations
    calculateSwap,
    calculateAddLiquidity,
    calculateRemoveLiquidity,
    
    // Queries
    getPool,
    getPoolByTokens,
    getUserPositions,
    getPoolStats
  }
}

/**
 * Hook especializado para dados de um pool específico
 */
export const usePool = (poolId: string) => {
  const { 
    pools, 
    positions, 
    addLiquidity, 
    removeLiquidity, 
    claimRewards,
    calculateAddLiquidity,
    calculateRemoveLiquidity,
    getPoolStats,
    loading, 
    error 
  } = useDEX()
  
  const pool = pools.find(p => p.id === poolId)
  const userPositions = positions.filter(p => p.poolId === poolId)
  const stats = pool ? getPoolStats(poolId) : null
  
  return {
    pool,
    positions: userPositions,
    stats,
    loading,
    error,
    addLiquidity: (amountA: number, amountB: number) => addLiquidity(poolId, amountA, amountB),
    removeLiquidity: (lpAmount: number) => removeLiquidity(poolId, lpAmount),
    claimRewards: () => claimRewards(poolId),
    calculateAddLiquidity: (amountA: number) => calculateAddLiquidity(poolId, amountA),
    calculateRemoveLiquidity: (lpAmount: number) => calculateRemoveLiquidity(poolId, lpAmount)
  }
}

/**
 * Hook para gerenciar swaps
 */
export const useSwap = () => {
  const { pools, swap, calculateSwap, loading, error } = useDEX()
  
  const [selectedPool, setSelectedPool] = useState<string>('')
  const [tokenIn, setTokenIn] = useState<string>('')
  const [tokenOut, setTokenOut] = useState<string>('')
  const [amountIn, setAmountIn] = useState<number>(0)
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.005) // 0.5%
  
  const calculation = selectedPool && tokenIn && amountIn > 0 
    ? calculateSwap(selectedPool, tokenIn, amountIn) 
    : null
  
  const minAmountOut = calculation 
    ? calculateMinimumAmountOut(calculation.amountOut, slippageTolerance)
    : 0
  
  const executeSwap = useCallback(async () => {
    if (!selectedPool || !tokenIn || amountIn <= 0) {
      throw new Error('Invalid swap parameters')
    }
    
    await swap(selectedPool, tokenIn, amountIn, minAmountOut)
  }, [selectedPool, tokenIn, amountIn, minAmountOut, swap])
  
  return {
    // State
    selectedPool,
    tokenIn,
    tokenOut,
    amountIn,
    slippageTolerance,
    
    // Setters
    setSelectedPool,
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setSlippageTolerance,
    
    // Calculations
    calculation,
    minAmountOut,
    
    // Actions
    executeSwap,
    
    // Data
    pools,
    loading,
    error
  }
}