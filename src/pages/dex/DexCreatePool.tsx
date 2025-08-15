// src/pages/dex/DexCreatePool.tsx

import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDEX } from '@features/dex/hooks/useDEX'
import { NATIVE_TOKENS, DEX_CONSTANTS } from '@features/dex/types/dex.types'

export const DexCreatePool: FC = () => {
  const navigate = useNavigate()
  const { createPool, getPoolByTokens, loading } = useDEX()
  
  const [formData, setFormData] = useState({
    tokenA: 'BZR',
    tokenB: 'ZARI',
    amountA: '',
    amountB: '',
    swapFee: DEX_CONSTANTS.DEFAULT_SWAP_FEE * 100, // Convert to percentage
    rewardRate: 5 // Default 5 ZARI per minute
  })
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const tokens = Object.values(NATIVE_TOKENS)
  const existingPool = getPoolByTokens(formData.tokenA, formData.tokenB)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const calculateInitialPrice = (): number => {
    const amountA = parseFloat(formData.amountA) || 0
    const amountB = parseFloat(formData.amountB) || 0
    
    if (amountA === 0 || amountB === 0) return 0
    return amountB / amountA
  }

  const calculatePoolValue = (): number => {
    const amountA = parseFloat(formData.amountA) || 0
    const amountB = parseFloat(formData.amountB) || 0
    
    // Simplified calculation assuming 1 BZR = 1 BZR value
    return amountA + amountB
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.amountA || !formData.amountB) {
      setError('Todas as quantidades são obrigatórias')
      return
    }

    const amountA = parseFloat(formData.amountA)
    const amountB = parseFloat(formData.amountB)

    if (amountA <= 0 || amountB <= 0) {
      setError('Quantidades devem ser positivas')
      return
    }

    if (amountA + amountB < DEX_CONSTANTS.MIN_POOL_SIZE) {
      setError(`Valor mínimo do pool é ${DEX_CONSTANTS.MIN_POOL_SIZE} BZR`)
      return
    }

    if (formData.tokenA === formData.tokenB) {
      setError('Tokens devem ser diferentes')
      return
    }

    if (existingPool) {
      setError('Pool já existe para este par de tokens')
      return
    }

    try {
      const poolId = await createPool(formData.tokenA, formData.tokenB, amountA, amountB)
      setSuccess(true)
      
      setTimeout(() => {
        navigate(`/dex/pools/${poolId}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pool')
    }
  }

  // Mock balance check
  const getMockBalance = (token: string): number => {
    return token === 'BZR' ? 50000 : 12500
  }

  const hasEnoughBalance = (): boolean => {
    const amountA = parseFloat(formData.amountA) || 0
    const amountB = parseFloat(formData.amountB) || 0
    
    return amountA <= getMockBalance(formData.tokenA) && 
           amountB <= getMockBalance(formData.tokenB)
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-green-600 text-4xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Pool criado com sucesso!
            </h2>
            <p className="text-green-700 mb-4">
              Seu pool {formData.tokenA}-{formData.tokenB} foi criado e você recebeu os primeiros LP tokens.
            </p>
            <div className="text-sm text-green-600">
              Redirecionando para detalhes do pool...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Criar Novo Pool de Liquidez
          </h1>
          <p className="text-gray-600">
            Crie um pool para permitir swaps entre dois tokens e ganhe taxas como provedor de liquidez
          </p>
        </div>

        {/* Warning for existing pool */}
        {existingPool && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <span>⚠️</span>
              <span className="font-medium">Pool já existe</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Um pool para {formData.tokenA}-{formData.tokenB} já existe. 
              Você pode adicionar liquidez ao pool existente ao invés de criar um novo.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Selecionar Tokens
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token A
                  </label>
                  <select
                    value={formData.tokenA}
                    onChange={(e) => handleInputChange('tokenA', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {tokens.map(token => (
                      <option key={token.id} value={token.id}>
                        {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token B
                  </label>
                  <select
                    value={formData.tokenB}
                    onChange={(e) => handleInputChange('tokenB', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {tokens.map(token => (
                      <option key={token.id} value={token.id}>
                        {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Initial Liquidity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Liquidez Inicial
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de {formData.tokenA}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.amountA}
                      onChange={(e) => handleInputChange('amountA', e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.000001"
                    />
                    <div className="absolute right-2 top-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('amountA', getMockBalance(formData.tokenA).toString())}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Saldo: {getMockBalance(formData.tokenA).toLocaleString()} {formData.tokenA}
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    +
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de {formData.tokenB}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.amountB}
                      onChange={(e) => handleInputChange('amountB', e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.000001"
                    />
                    <div className="absolute right-2 top-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('amountB', getMockBalance(formData.tokenB).toString())}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Saldo: {getMockBalance(formData.tokenB).toLocaleString()} {formData.tokenB}
                  </div>
                </div>
              </div>
            </div>

            {/* Pool Configuration */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuração do Pool
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa de Swap (%)
                  </label>
                  <select
                    value={formData.swapFee}
                    onChange={(e) => handleInputChange('swapFee', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0.1}>0.1% - Ultra baixa</option>
                    <option value={0.3}>0.3% - Padrão</option>
                    <option value={0.5}>0.5% - Média</option>
                    <option value={1.0}>1.0% - Alta</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Taxa cobrada em cada swap
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recompensa (ZARI/min)
                  </label>
                  <input
                    type="number"
                    value={formData.rewardRate}
                    onChange={(e) => handleInputChange('rewardRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.1"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    ZARI distribuído por minuto
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-600">❌ {error}</div>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dex/pools')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !hasEnoughBalance() || !!existingPool}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Criando Pool...' : 
                 !hasEnoughBalance() ? 'Saldo Insuficiente' :
                 existingPool ? 'Pool Já Existe' :
                 'Criar Pool'}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pool Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Preview do Pool</h3>
              
              {formData.amountA && formData.amountB ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Par</span>
                    <span className="font-medium">{formData.tokenA}-{formData.tokenB}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço inicial</span>
                    <span className="font-medium">
                      1 {formData.tokenA} = {calculateInitialPrice().toFixed(6)} {formData.tokenB}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor do pool</span>
                    <span className="font-medium">{calculatePoolValue().toFixed(2)} BZR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de swap</span>
                    <span className="font-medium">{formData.swapFee}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">APR estimado</span>
                    <span className="font-medium text-green-600">
                      {calculatePoolValue() > 0 ? ((formData.rewardRate * 1440 * 365 * 4) / calculatePoolValue() * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Digite as quantidades para ver o preview
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">📋 Requisitos</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Valor mínimo do pool: {DEX_CONSTANTS.MIN_POOL_SIZE} BZR</li>
                <li>• Você receberá LP tokens proporcionais</li>
                <li>• Como criador, você será o primeiro LP</li>
                <li>• Defina um preço inicial justo</li>
                <li>• Pool será imediatamente ativo para swaps</li>
              </ul>
            </div>

            {/* LP Token Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">LP Tokens</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Ao criar o pool, você receberá LP tokens que representam sua 
                  participação no pool.
                </p>
                <p>
                  LP tokens dão direito a:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Parte das taxas de swap</li>
                  <li>Recompensas em ZARI</li>
                  <li>Retirada proporcional da liquidez</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}