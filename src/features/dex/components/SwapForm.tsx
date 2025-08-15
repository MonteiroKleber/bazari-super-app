// src/features/dex/components/SwapForm.tsx

import { FC, useState, useEffect } from 'react'
import { Pool, SwapCalculation, NATIVE_TOKENS } from '../types/dex.types'

interface SwapFormProps {
  pools: Pool[]
  onSwap: (poolId: string, tokenIn: string, amountIn: number, minAmountOut: number) => Promise<void>
  calculateSwap: (poolId: string, tokenIn: string, amountIn: number) => SwapCalculation | null
  loading?: boolean
}

export const SwapForm: FC<SwapFormProps> = ({
  pools,
  onSwap,
  calculateSwap,
  loading = false
}) => {
  const [tokenIn, setTokenIn] = useState<string>('BZR')
  const [tokenOut, setTokenOut] = useState<string>('ZARI')
  const [amountIn, setAmountIn] = useState<string>('')
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5) // 0.5%
  const [calculation, setCalculation] = useState<SwapCalculation | null>(null)

  // Encontrar pool para o par selecionado
  const selectedPool = pools.find(pool => 
    (pool.tokenA.id === tokenIn && pool.tokenB.id === tokenOut) ||
    (pool.tokenA.id === tokenOut && pool.tokenB.id === tokenIn)
  )

  // Recalcular quando inputs mudam
  useEffect(() => {
    if (selectedPool && amountIn && parseFloat(amountIn) > 0) {
      const calc = calculateSwap(selectedPool.id, tokenIn, parseFloat(amountIn))
      setCalculation(calc)
    } else {
      setCalculation(null)
    }
  }, [selectedPool, tokenIn, amountIn, calculateSwap])

  const handleSwapTokens = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setAmountIn('')
  }

  const handleMaxClick = () => {
    // TODO: Integrar com saldos reais da wallet
    const mockBalance = tokenIn === 'BZR' ? 50000 : 12500
    setAmountIn(mockBalance.toString())
  }

  const handleSwap = async () => {
    if (!selectedPool || !calculation || !amountIn || parseFloat(amountIn) <= 0) {
      return
    }

    try {
      const slippageDecimal = slippageTolerance / 100
      const minAmountOut = calculation.amountOut * (1 - slippageDecimal)
      
      await onSwap(selectedPool.id, tokenIn, parseFloat(amountIn), minAmountOut)
      setAmountIn('')
      setCalculation(null)
    } catch (error) {
      console.error('Swap failed:', error)
    }
  }

  const getPriceImpactColor = (impact: number): string => {
    if (impact < 0.01) return 'text-green-600' // < 1%
    if (impact < 0.03) return 'text-yellow-600' // < 3%
    return 'text-red-600' // >= 3%
  }

  const tokens = Object.values(NATIVE_TOKENS)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Swap</h3>
        <button className="text-sm text-gray-500 hover:text-gray-700">
          ⚙️ Configurações
        </button>
      </div>

      {/* Token In */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Você paga
        </label>
        <div className="relative">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.0"
            className="w-full p-4 pr-32 text-right text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-2 flex items-center gap-2">
            <button
              onClick={handleMaxClick}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              MAX
            </button>
            <select
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value)}
              className="px-3 py-2 bg-gray-100 border-0 rounded-lg font-medium"
            >
              {tokens.map(token => (
                <option key={token.id} value={token.id}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Saldo: {tokenIn === 'BZR' ? '50,000' : '12,500'} {tokenIn}
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-4">
        <button
          onClick={handleSwapTokens}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          ↕️
        </button>
      </div>

      {/* Token Out */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Você recebe
        </label>
        <div className="relative">
          <input
            type="text"
            value={calculation ? calculation.amountOut.toFixed(8) : ''}
            placeholder="0.0"
            readOnly
            className="w-full p-4 pr-32 text-right text-xl border border-gray-300 rounded-lg bg-gray-50"
          />
          <div className="absolute right-2 top-2">
            <select
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value)}
              className="px-3 py-2 bg-gray-100 border-0 rounded-lg font-medium"
            >
              {tokens.map(token => (
                <option key={token.id} value={token.id}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Swap Details */}
      {calculation && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxa de câmbio</span>
            <span>1 {tokenIn} = {calculation.rate.toFixed(6)} {tokenOut}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Impacto no preço</span>
            <span className={getPriceImpactColor(calculation.priceImpact)}>
              {(calculation.priceImpact * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxa de swap</span>
            <span>{calculation.fee.toFixed(6)} {tokenIn}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mínimo recebido</span>
            <span>{calculation.minimumReceived.toFixed(6)} {tokenOut}</span>
          </div>
        </div>
      )}

      {/* Slippage Tolerance */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tolerância ao slippage
        </label>
        <div className="flex gap-2">
          {[0.1, 0.5, 1.0].map(value => (
            <button
              key={value}
              onClick={() => setSlippageTolerance(value)}
              className={`px-3 py-2 rounded text-sm ${
                slippageTolerance === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}%
            </button>
          ))}
          <input
            type="number"
            value={slippageTolerance}
            onChange={(e) => setSlippageTolerance(parseFloat(e.target.value) || 0)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            step="0.1"
            min="0"
            max="50"
          />
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={loading || !calculation || !selectedPool || !amountIn}
        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processando...' : 
         !selectedPool ? 'Pool não encontrado' :
         !amountIn ? 'Digite uma quantidade' :
         'Fazer Swap'}
      </button>

      {!selectedPool && tokenIn !== tokenOut && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Pool para {tokenIn}-{tokenOut} não existe. Você pode criar um novo pool.
          </p>
        </div>
      )}
    </div>
  )
}





