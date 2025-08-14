// src/pages/wallet/WalletAccounts.tsx

import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@shared/ui'
import { Icons } from '@shared/ui'
import { WalletHeader } from '@features/wallet/components/WalletHeader'
import { AccountManager } from '@features/wallet/components/AccountManager'

export const WalletAccounts: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <WalletHeader title="Gerenciar Contas" showAccountSwitcher={false} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 mb-6 text-sm">
          <Link 
            to="/wallet" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Wallet
          </Link>
          <Icons.ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Contas</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link to="/wallet">
            <Button variant="outline" className="flex items-center space-x-2">
              <Icons.ArrowLeft className="h-4 w-4" />
              <span>Voltar à Wallet</span>
            </Button>
          </Link>
        </div>

        {/* Account Manager Component */}
        <AccountManager />
      </div>
    </div>
  )
}