// src/features/wallet/components/TokenList.tsx

import { FC } from 'react'
import { Button, Badge, Tooltip } from '@shared/ui'
import { Icons } from '@shared/ui'
import { useWallet } from '../hooks/useWallet'
import type { TokenBalance } from '../hooks/useWallet'

interface TokenItemProps {
  token: TokenBalance
  onClick?: () => void
}

const TokenItem: FC<TokenItemProps> = ({ token, onClick }) => {
  const formatBalance = (amount: string): string => {
    const num = parseFloat(amount)
    if (isNaN(num)) return '0.0000'
    
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })
  }

  const formatUsdValue = (amount: string, symbol: string): string => {
    const num = parseFloat(amount)
    if (isNaN(num)) return '$0.00'
    
    // Mock prices for demonstration
    const mockPrices: Record<string, number> = {
      'BZR': 0.75,
      'USDT': 1.00,
      'GAME': 0.25,
    }
    
    const usdPrice = mockPrices[symbol] || 0
    const usdValue = num * usdPrice
    
    return usdValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'USD'
    })
  }

  return (
    <button
      onClick={onClick}
      className="w-full p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
      disabled={!onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Token Icon */}
          <div className="relative">
            {token.icon ? (
              <img
                src={token.icon}
                alt={token.name}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  // Fallback to default icon if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${
              token.isNative 
                ? 'from-primary-400 to-primary-600' 
                : 'from-gray-400 to-gray-600'
            } ${token.icon ? 'hidden' : ''}`}>
              <span className="text-white font-semibold text-sm">
                {token.symbol.slice(0, 2)}
              </span>
            </div>
            
            {/* Native token indicator */}
            {token.isNative && (
              <div className="absolute -top-1 -right-1">
                <Badge variant="warning" className="px-1 py-0 text-xs">
                  <Icons.Star className="h-2 w-2" />
                </Badge>
              </div>
            )}
          </div>

          {/* Token Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {token.name}
              </h3>
              {token.isNative && (
                <Badge variant="primary" size="sm">
                  Nativo
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">
              {token.symbol} • {formatUsdValue(token.amount, token.symbol)}
            </p>
          </div>
        </div>

        {/* Balance */}
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            {formatBalance(token.amount)}
          </p>
          <p className="text-sm text-gray-500">
            {token.symbol}
          </p>
        </div>
      </div>
    </button>
  )
}

export const TokenList: FC = () => {
  const { 
    tokens, 
    isLoadingTokens, 
    hasMoreTokens, 
    tokenSearchQuery,
    activeAccount 
  } = useWallet()

  const handleTokenClick = (token: TokenBalance) => {
    // Future: Navigate to token detail page
    console.log('🔮 Token detail page em breve:', token.symbol)
  }

  if (!activeAccount) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Icons.Wallet className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p>Selecione uma conta para ver os tokens</p>
      </div>
    )
  }

  if (isLoadingTokens && tokens.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Icons.Coins className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p className="font-medium mb-1">
          {tokenSearchQuery ? 'Nenhum token encontrado' : 'Nenhum token disponível'}
        </p>
        <p className="text-sm">
          {tokenSearchQuery 
            ? 'Tente uma busca diferente'
            : 'Os tokens aparecerão aqui quando disponíveis'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Token List */}
      <div>
        {tokens.map((token) => (
          <TokenItem
            key={token.id}
            token={token}
            onClick={() => handleTokenClick(token)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreTokens && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <Button
            variant="outline"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 hover:border-yellow-500"
            disabled={isLoadingTokens}
          >
            {isLoadingTokens ? (
              <>
                <Icons.Loader className="h-4 w-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              'Carregar mais'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}