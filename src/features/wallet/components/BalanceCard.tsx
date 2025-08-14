// src/features/wallet/components/BalanceCard.tsx

import { FC, useMemo } from 'react'
import { Card, Button, Tooltip } from '@shared/ui'
import { Icons } from '@shared/ui'
import { useWallet } from '../hooks/useWallet'

export const BalanceCard: FC = () => {
  const { 
    tokens, 
    isLoadingTokens, 
    activeAccount, 
    refreshBalances 
  } = useWallet()

  // Find BZR balance (native token)
  const bzrBalance = useMemo(() => {
    return tokens.find(token => token.isNative || token.symbol === 'BZR')
  }, [tokens])

  // Format balance for display
  const formatBalance = (amount: string): string => {
    const num = parseFloat(amount)
    if (isNaN(num)) return '0.0000'
    
    // Format with thousand separators
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })
  }

  // Calculate USD value (mock)
  const usdValue = useMemo(() => {
    if (!bzrBalance) return '0.00'
    
    const amount = parseFloat(bzrBalance.amount)
    const mockUsdPrice = 0.75 // Mock: 1 BZR = $0.75
    
    return (amount * mockUsdPrice).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'USD'
    })
  }, [bzrBalance])

  const handleMockAction = (action: string) => {
    // Mock toast notification would go here
    console.log(`🚧 ${action} em breve...`)
  }

  if (!activeAccount) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Icons.Wallet className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>Selecione uma conta para ver o saldo</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Icons.Wallet className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-800">
              Saldo Principal
            </span>
          </div>
          <p className="text-xs text-primary-600">
            {activeAccount.name}
          </p>
        </div>

        <Tooltip content="Atualizar saldos">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshBalances}
            disabled={isLoadingTokens}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-200"
          >
            <Icons.RefreshCw className={`h-4 w-4 ${
              isLoadingTokens ? 'animate-spin' : ''
            }`} />
          </Button>
        </Tooltip>
      </div>

      {/* Main Balance */}
      <div className="mb-4">
        <div className="flex items-end space-x-2 mb-1">
          <span className="text-3xl font-bold text-primary-900">
            {isLoadingTokens ? (
              <div className="h-8 w-32 bg-primary-200 animate-pulse rounded" />
            ) : (
              formatBalance(bzrBalance?.amount || '0')
            )}
          </span>
          <span className="text-lg font-medium text-primary-700 mb-1">
            {bzrBalance?.symbol || 'BZR'}
          </span>
        </div>
        
        <p className="text-sm text-primary-600">
          ≈ {usdValue}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Tooltip content="Em breve">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMockAction('Depositar')}
            className="flex-1 border-primary-300 text-primary-700 hover:bg-primary-200"
            disabled
          >
            <Icons.ArrowDownLeft className="h-4 w-4 mr-1" />
            Depositar
          </Button>
        </Tooltip>

        <Tooltip content="Em breve">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMockAction('Enviar')}
            className="flex-1 border-primary-300 text-primary-700 hover:bg-primary-200"
            disabled
          >
            <Icons.Send className="h-4 w-4 mr-1" />
            Enviar
          </Button>
        </Tooltip>

        <Tooltip content="Em breve">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMockAction('Sacar')}
            className="flex-1 border-primary-300 text-primary-700 hover:bg-primary-200"
            disabled
          >
            <Icons.ArrowUpRight className="h-4 w-4 mr-1" />
            Sacar
          </Button>
        </Tooltip>
      </div>

      {/* Additional info */}
      <div className="mt-4 pt-4 border-t border-primary-200">
        <div className="flex justify-between text-xs text-primary-600">
          <span>Tokens disponíveis:</span>
          <span>{tokens.length}</span>
        </div>
      </div>
    </Card>
  )
}