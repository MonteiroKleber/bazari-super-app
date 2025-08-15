// src/features/dex/engine/amm.ts

import { DEX_CONSTANTS } from '../types/dex.types'

/**
 * Engine AMM (Automated Market Maker) baseado na fórmula x·y=k
 * Implementa todas as funções matemáticas para o DEX
 */

/**
 * Calcula a quantidade de LP tokens para primeira adição de liquidez
 * Formula: LP = sqrt(x * y)
 */
export function calculateInitialLPTokens(amountA: number, amountB: number): number {
  if (amountA <= 0 || amountB <= 0) {
    throw new Error('Amounts must be positive')
  }
  
  return Math.sqrt(amountA * amountB)
}

/**
 * Calcula LP tokens para adição de liquidez subsequente
 * Formula: LP_new = min(deltaX/X, deltaY/Y) * LP_total
 */
export function calculateLPTokens(
  amountA: number,
  amountB: number,
  reserveA: number,
  reserveB: number,
  totalLPSupply: number
): number {
  if (reserveA <= 0 || reserveB <= 0 || totalLPSupply <= 0) {
    throw new Error('Invalid reserves or LP supply')
  }
  
  const ratioA = amountA / reserveA
  const ratioB = amountB / reserveB
  const minRatio = Math.min(ratioA, ratioB)
  
  return minRatio * totalLPSupply
}

/**
 * Calcula quantidades de token necessárias para manter proporção
 */
export function calculateProportionalAmounts(
  inputAmount: number,
  inputIsTokenA: boolean,
  reserveA: number,
  reserveB: number
): { amountA: number; amountB: number } {
  if (reserveA <= 0 || reserveB <= 0) {
    throw new Error('Invalid reserves')
  }
  
  if (inputIsTokenA) {
    const amountB = (inputAmount * reserveB) / reserveA
    return { amountA: inputAmount, amountB }
  } else {
    const amountA = (inputAmount * reserveA) / reserveB
    return { amountA, amountB }
  }
}

/**
 * Calcula output de swap com taxas
 * Formula: y_out = (y * x_in * (1 - fee)) / (x + x_in * (1 - fee))
 */
export function calculateSwapOutput(
  amountIn: number,
  reserveIn: number,
  reserveOut: number,
  swapFee: number = DEX_CONSTANTS.DEFAULT_SWAP_FEE
): {
  amountOut: number
  priceImpact: number
  effectivePrice: number
} {
  if (amountIn <= 0 || reserveIn <= 0 || reserveOut <= 0) {
    throw new Error('Invalid amounts or reserves')
  }
  
  // Preço antes do swap
  const priceBeforeSwap = reserveOut / reserveIn
  
  // Quantidade após taxa
  const amountInWithFee = amountIn * (1 - swapFee)
  
  // Nova reserva de entrada
  const newReserveIn = reserveIn + amountInWithFee
  
  // Constante k
  const k = reserveIn * reserveOut
  
  // Nova reserva de saída
  const newReserveOut = k / newReserveIn
  
  // Quantidade de saída
  const amountOut = reserveOut - newReserveOut
  
  if (amountOut <= 0) {
    throw new Error('Insufficient liquidity')
  }
  
  // Preço após o swap
  const priceAfterSwap = newReserveOut / newReserveIn
  
  // Impacto no preço
  const priceImpact = Math.abs(priceAfterSwap - priceBeforeSwap) / priceBeforeSwap
  
  // Preço efetivo da transação
  const effectivePrice = amountOut / amountIn
  
  return {
    amountOut: roundToDecimals(amountOut, DEX_CONSTANTS.REWARD_PRECISION),
    priceImpact: roundToDecimals(priceImpact, 6),
    effectivePrice: roundToDecimals(effectivePrice, DEX_CONSTANTS.REWARD_PRECISION)
  }
}

/**
 * Calcula quantidade de entrada necessária para obter quantidade específica de saída
 */
export function calculateSwapInput(
  amountOut: number,
  reserveIn: number,
  reserveOut: number,
  swapFee: number = DEX_CONSTANTS.DEFAULT_SWAP_FEE
): number {
  if (amountOut <= 0 || reserveIn <= 0 || reserveOut <= 0) {
    throw new Error('Invalid amounts or reserves')
  }
  
  if (amountOut >= reserveOut) {
    throw new Error('Insufficient liquidity for requested output')
  }
  
  // k = x * y
  const k = reserveIn * reserveOut
  
  // Nova reserva de saída após o swap
  const newReserveOut = reserveOut - amountOut
  
  // Nova reserva de entrada necessária
  const newReserveIn = k / newReserveOut
  
  // Quantidade de entrada antes da taxa
  const amountInBeforeFee = newReserveIn - reserveIn
  
  // Quantidade de entrada incluindo taxa
  const amountIn = amountInBeforeFee / (1 - swapFee)
  
  return roundToDecimals(amountIn, DEX_CONSTANTS.REWARD_PRECISION)
}

/**
 * Calcula tokens recebidos ao remover liquidez
 */
export function calculateRemoveLiquidity(
  lpAmount: number,
  totalLPSupply: number,
  reserveA: number,
  reserveB: number
): {
  amountA: number
  amountB: number
  shareRemoved: number
} {
  if (lpAmount <= 0 || totalLPSupply <= 0 || reserveA <= 0 || reserveB <= 0) {
    throw new Error('Invalid parameters for liquidity removal')
  }
  
  if (lpAmount > totalLPSupply) {
    throw new Error('LP amount exceeds total supply')
  }
  
  const shareRemoved = lpAmount / totalLPSupply
  const amountA = shareRemoved * reserveA
  const amountB = shareRemoved * reserveB
  
  return {
    amountA: roundToDecimals(amountA, DEX_CONSTANTS.REWARD_PRECISION),
    amountB: roundToDecimals(amountB, DEX_CONSTANTS.REWARD_PRECISION),
    shareRemoved: roundToDecimals(shareRemoved, 6)
  }
}

/**
 * Calcula preço atual de um token em relação ao outro
 */
export function calculatePrice(reserveA: number, reserveB: number): {
  priceAInB: number
  priceBInA: number
} {
  if (reserveA <= 0 || reserveB <= 0) {
    throw new Error('Invalid reserves for price calculation')
  }
  
  return {
    priceAInB: roundToDecimals(reserveB / reserveA, DEX_CONSTANTS.REWARD_PRECISION),
    priceBInA: roundToDecimals(reserveA / reserveB, DEX_CONSTANTS.REWARD_PRECISION)
  }
}

/**
 * Calcula slippage baseado na tolerância e no price impact
 */
export function calculateSlippage(
  expectedOutput: number,
  actualOutput: number
): number {
  if (expectedOutput <= 0) {
    throw new Error('Expected output must be positive')
  }
  
  const slippage = (expectedOutput - actualOutput) / expectedOutput
  return Math.max(0, roundToDecimals(slippage, 6))
}

/**
 * Calcula minimum amount out baseado na tolerância ao slippage
 */
export function calculateMinimumAmountOut(
  amountOut: number,
  slippageTolerance: number
): number {
  if (slippageTolerance < 0 || slippageTolerance > 1) {
    throw new Error('Slippage tolerance must be between 0 and 1')
  }
  
  return roundToDecimals(amountOut * (1 - slippageTolerance), DEX_CONSTANTS.REWARD_PRECISION)
}

/**
 * Calcula APR (Annual Percentage Rate) para um pool
 */
export function calculateAPR(
  rewardRate: number, // tokens por minuto
  rewardTokenPrice: number, // preço do token de recompensa
  totalLiquidityValue: number // valor total da liquidez em USD/BZR
): number {
  if (totalLiquidityValue <= 0) {
    return 0
  }
  
  // Recompensas por ano
  const rewardsPerYear = rewardRate * DEX_CONSTANTS.MINUTES_PER_DAY * DEX_CONSTANTS.DAYS_PER_YEAR
  const yearlyRewardValue = rewardsPerYear * rewardTokenPrice
  
  // APR = (valor anual das recompensas / liquidez total) * 100
  const apr = (yearlyRewardValue / totalLiquidityValue) * 100
  
  return roundToDecimals(apr, 2)
}

/**
 * Calcula recompensas acumuladas
 */
export function calculateRewards(
  lpBalance: number,
  totalLPSupply: number,
  rewardRate: number, // por minuto
  timeElapsedMinutes: number
): number {
  if (totalLPSupply <= 0 || lpBalance <= 0) {
    return 0
  }
  
  const sharePercentage = lpBalance / totalLPSupply
  const totalRewards = rewardRate * timeElapsedMinutes
  const userRewards = totalRewards * sharePercentage
  
  return roundToDecimals(userRewards, DEX_CONSTANTS.REWARD_PRECISION)
}

/**
 * Calcula TVL (Total Value Locked) de um pool
 */
export function calculateTVL(
  reserveA: number,
  reserveB: number,
  priceA: number, // preço em BZR ou USD
  priceB: number  // preço em BZR ou USD
): number {
  const valueA = reserveA * priceA
  const valueB = reserveB * priceB
  
  return roundToDecimals(valueA + valueB, 2)
}

/**
 * Valida se uma operação de swap é válida
 */
export function validateSwap(
  amountIn: number,
  reserveIn: number,
  reserveOut: number,
  maxSlippage: number = DEX_CONSTANTS.MAX_SLIPPAGE
): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (amountIn <= 0) {
    errors.push('Amount in must be positive')
  }
  
  if (reserveIn <= 0 || reserveOut <= 0) {
    errors.push('Pool has insufficient liquidity')
  }
  
  if (amountIn >= reserveIn) {
    errors.push('Amount in exceeds available liquidity')
  }
  
  // Verificar price impact
  try {
    const { priceImpact } = calculateSwapOutput(amountIn, reserveIn, reserveOut)
    if (priceImpact > maxSlippage) {
      errors.push(`Price impact too high: ${(priceImpact * 100).toFixed(2)}%`)
    }
  } catch (error) {
    errors.push('Error calculating price impact')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Utility function para arredondar para número específico de casas decimais
 */
function roundToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Calcula a constante K de um pool
 */
export function calculateK(reserveA: number, reserveB: number): number {
  return reserveA * reserveB
}

/**
 * Verifica se a invariante K é mantida após uma operação
 */
export function validateInvariant(
  oldReserveA: number,
  oldReserveB: number,
  newReserveA: number,
  newReserveB: number,
  tolerance: number = 0.0001
): boolean {
  const oldK = calculateK(oldReserveA, oldReserveB)
  const newK = calculateK(newReserveA, newReserveB)
  
  const difference = Math.abs(newK - oldK) / oldK
  return difference <= tolerance
}