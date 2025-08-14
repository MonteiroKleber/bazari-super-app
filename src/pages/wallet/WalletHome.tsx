// src/pages/wallet/WalletHome.tsx

import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button } from '@shared/ui'
import { Icons } from '@shared/ui'
import { WalletHeader } from '@features/wallet/components/WalletHeader'
import { BalanceCard } from '@features/wallet/components/BalanceCard'
import { AssetTabs } from '@features/wallet/components/AssetTabs'
import { useWallet } from '@features/wallet/hooks/useWallet'

const RecentTransactions: FC = () => {
  const { transactions, isLoadingTxs, activeAccount } = useWallet()

  // Show only first 5 transactions
  const recentTxs = transactions.slice(0, 5)

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <Icons.Check className="h-4 w-4" />
      case 'failed': return <Icons.X className="h-4 w-4" />
      case 'pending': return <Icons.Clock className="h-4 w-4" />
      default: return <Icons.Circle className="h-4 w-4" />
    }
  }

  const formatAmount = (amount: string, token: string): string => {
    const num = parseFloat(amount)
    if (isNaN(num)) return '0.0000'
    
    return `${num.toLocaleString('pt-BR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })} ${token}`
  }

  const formatAddress = (address: string): string => {
    if (!address || address.length < 8) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!activeAccount) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Icons.Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>Selecione uma conta para ver as transações</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Últimas Transações
          </h3>
          <Link
            to="/wallet/history"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todas
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoadingTxs && recentTxs.length === 0 ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
              </div>
            </div>
          ))
        ) : recentTxs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Icons.Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="font-medium mb-1">Nenhuma transação encontrada</p>
            <p className="text-sm">As transações aparecerão aqui quando disponíveis</p>
          </div>
        ) : (
          recentTxs.map((tx) => (
            <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                {/* Transaction Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.status === 'success' ? 'bg-green-100' :
                  tx.status === 'failed' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <span className={getStatusColor(tx.status)}>
                    {getStatusIcon(tx.status)}
                  </span>
                </div>

                {/* Transaction Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tx.from === activeAccount.address ? 'Envio' : 'Recebimento'}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === 'success' ? 'bg-green-100 text-green-800' :
                      tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status === 'success' ? 'Sucesso' :
                       tx.status === 'failed' ? 'Falhou' : 'Pendente'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {tx.from === activeAccount.address 
                      ? `Para: ${formatAddress(tx.to)}`
                      : `De: ${formatAddress(tx.from)}`
                    }
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    tx.from === activeAccount.address ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {tx.from === activeAccount.address ? '-' : '+'}
                    {formatAmount(tx.amount, tx.token)}
                  </p>
                  {tx.fee && (
                    <p className="text-xs text-gray-500">
                      Taxa: {tx.fee} BZR
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {recentTxs.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Link
            to="/wallet/history"
            className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver histórico completo
            <Icons.ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )}
    </Card>
  )
}

const QuickActions: FC = () => {
  const handleAction = (action: string) => {
    console.log(`🚧 ${action} em breve...`)
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ações Rápidas
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/wallet/staking"
          className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-colors"
        >
          <div className="w-8 h-8 bg-primary-200 rounded-lg flex items-center justify-center">
            <Icons.TrendingUp className="h-4 w-4 text-primary-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-900">Staking</p>
            <p className="text-xs text-primary-600">Ganhe recompensas</p>
          </div>
        </Link>

        <Link
          to="/wallet/accounts"
          className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors"
        >
          <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
            <Icons.User className="h-4 w-4 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Contas</p>
            <p className="text-xs text-blue-600">Gerenciar contas</p>
          </div>
        </Link>

        <button
          onClick={() => handleAction('Swap')}
          className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors"
          disabled
        >
          <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
            <Icons.ArrowLeftRight className="h-4 w-4 text-green-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-900">Swap</p>
            <p className="text-xs text-green-600">Em breve</p>
          </div>
        </button>

        <button
          onClick={() => handleAction('Bridge')}
          className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors"
          disabled
        >
          <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center">
            <Icons.ArrowLeftRight className="h-4 w-4 text-purple-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-900">Bridge</p>
            <p className="text-xs text-purple-600">Em breve</p>
          </div>
        </button>
      </div>
    </Card>
  )
}

export const WalletHome: FC = () => {
  const { activeAccount, isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <WalletHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Balance & Assets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <BalanceCard />

            {/* Asset Tabs */}
            <AssetTabs />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Transactions */}
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  )
}