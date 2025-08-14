// src/features/wallet/components/AccountSwitcher.tsx

import { FC, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@shared/ui'
import { Icons } from '@shared/ui'
import { useWallet } from '../hooks/useWallet'

export const AccountSwitcher: FC = () => {
  const { 
    accounts, 
    activeAccount, 
    setActiveAccount, 
    formatAddress 
  } = useWallet()
  
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAccountSelect = async (accountId: string) => {
    try {
      await setActiveAccount(accountId)
      setIsOpen(false)
    } catch (error) {
      console.error('Erro ao trocar conta:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
        aria-label="Alternar conta"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icons.User className="h-4 w-4" />
        <span className="hidden sm:inline">Contas</span>
        <Icons.ChevronDown className={`h-4 w-4 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Minhas Contas
              </h3>
              <Link
                to="/wallet/accounts"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Gerenciar
              </Link>
            </div>
          </div>

          {/* Account List */}
          <div className="py-2 max-h-64 overflow-y-auto">
            {accounts.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <Icons.User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma conta encontrada</p>
              </div>
            ) : (
              accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleAccountSelect(account.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    account.isActive ? 'bg-primary-50' : ''
                  }`}
                  disabled={account.isActive}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Account Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        account.isActive 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Icons.User className="h-4 w-4" />
                      </div>
                      
                      {/* Account Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-medium truncate ${
                            account.isActive ? 'text-primary-900' : 'text-gray-900'
                          }`}>
                            {account.name}
                          </p>
                          {account.isActive && (
                            <div className="flex items-center">
                              <Icons.Check className="h-3 w-3 text-primary-600" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {formatAddress(account.address)}
                        </p>
                      </div>
                    </div>

                    {/* Active indicator */}
                    {account.isActive && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100">
            <Link
              to="/wallet/accounts"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
            >
              <Icons.Plus className="h-4 w-4 mr-2" />
              Criar Nova Conta
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}