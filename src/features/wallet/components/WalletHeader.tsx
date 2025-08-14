// src/features/wallet/components/WalletHeader.tsx

import { FC, useState } from 'react'
import { Badge, Button, Tooltip } from '@shared/ui'
import { Icons } from '@shared/ui'
import { AccountSwitcher } from './AccountSwitcher'
import { useWallet } from '../hooks/useWallet'

interface WalletHeaderProps {
  title?: string
  showAccountSwitcher?: boolean
}

export const WalletHeader: FC<WalletHeaderProps> = ({
  title = 'Wallet',
  showAccountSwitcher = true
}) => {
  const { 
    isConnected, 
    networkLabel, 
    activeAccount, 
    copyToClipboard, 
    formatAddress 
  } = useWallet()
  
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (!activeAccount?.address) return

    const success = await copyToClipboard(activeAccount.address)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and Network */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icons.Wallet className="h-6 w-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          
          {/* Network Badge */}
          <Badge 
            variant={isConnected ? 'success' : 'error'}
            className="flex items-center space-x-1"
          >
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <span>{networkLabel || 'Desconectado'}</span>
          </Badge>
        </div>

        {/* Right side - Account info and switcher */}
        <div className="flex items-center space-x-4">
          {/* Active account info */}
          {activeAccount && (
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {activeAccount.name}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">
                    {formatAddress(activeAccount.address)}
                  </span>
                  <Tooltip content={copied ? "Copiado!" : "Copiar endereço"}>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Copiar endereço"
                    >
                      {copied ? (
                        <Icons.Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Icons.Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </Tooltip>
                </div>
              </div>
              
              {/* Account avatar/icon */}
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icons.User className="h-4 w-4 text-primary-600" />
              </div>
            </div>
          )}

          {/* Account Switcher */}
          {showAccountSwitcher && <AccountSwitcher />}
        </div>
      </div>

      {/* Connection status details */}
      {!isConnected && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icons.AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Conectando com a blockchain... Algumas funcionalidades podem estar limitadas.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}