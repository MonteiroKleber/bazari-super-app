// src/features/wallet/components/AccountManager.tsx

import { FC, useState } from 'react'
import { Card, Button, Input, Modal, Badge, Tooltip } from '@shared/ui'
import { Icons } from '@shared/ui'
import { useWallet } from '../hooks/useWallet'
import type { WalletAccount } from '../hooks/useWallet'

interface CreateAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

const CreateAccountModal: FC<CreateAccountModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [accountName, setAccountName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accountName.trim()) {
      setError('Nome da conta é obrigatório')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(accountName.trim())
      setAccountName('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setAccountName('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Criar Nova Conta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nome da Conta"
            placeholder="Ex: Conta Principal, Poupança..."
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            error={error}
            autoFocus
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            Escolha um nome que ajude a identificar esta conta
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!accountName.trim()}
          >
            Criar Conta
          </Button>
        </div>
      </form>
    </Modal>
  )
}

interface RenameAccountModalProps {
  isOpen: boolean
  onClose: () => void
  account: WalletAccount | null
  onSubmit: (accountId: string, newName: string) => Promise<void>
}

const RenameAccountModal: FC<RenameAccountModalProps> = ({ 
  isOpen, 
  onClose, 
  account, 
  onSubmit 
}) => {
  const [accountName, setAccountName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update local state when account changes
  useState(() => {
    if (account) {
      setAccountName(account.name)
    }
  }, [account])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!account || !accountName.trim()) {
      setError('Nome da conta é obrigatório')
      return
    }

    if (accountName.trim() === account.name) {
      onClose()
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(account.id, accountName.trim())
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao renomear conta')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setAccountName(account?.name || '')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Renomear Conta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Novo Nome"
            placeholder="Digite o novo nome da conta"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            error={error}
            autoFocus
            maxLength={50}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!accountName.trim() || accountName.trim() === account?.name}
          >
            Renomear
          </Button>
        </div>
      </form>
    </Modal>
  )
}

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  account: WalletAccount | null
  onSubmit: (accountId: string) => Promise<void>
}

const DeleteAccountModal: FC<DeleteAccountModalProps> = ({ 
  isOpen, 
  onClose, 
  account, 
  onSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleSubmit = async () => {
    if (!account) return

    setIsSubmitting(true)

    try {
      await onSubmit(account.id)
      setConfirmText('')
      onClose()
    } catch (err) {
      console.error('Erro ao remover conta:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  const isConfirmed = confirmText === account?.name

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Remover Conta">
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icons.AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Ação irreversível</h4>
              <p className="text-sm text-red-700 mt-1">
                Esta ação não pode ser desfeita. A conta será permanentemente removida.
              </p>
            </div>
          </div>
        </div>

        {account && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Para confirmar, digite o nome da conta: <strong>{account.name}</strong>
            </p>
            <Input
              placeholder="Digite o nome da conta"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!isConfirmed}
          >
            Remover Conta
          </Button>
        </div>
      </div>
    </Modal>
  )
}

interface AccountItemProps {
  account: WalletAccount
  onSetActive: (accountId: string) => void
  onRename: (account: WalletAccount) => void
  onDelete: (account: WalletAccount) => void
  formatAddress: (address: string) => string
  copyToClipboard: (text: string) => Promise<boolean>
}

const AccountItem: FC<AccountItemProps> = ({
  account,
  onSetActive,
  onRename,
  onDelete,
  formatAddress,
  copyToClipboard
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(account.address)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className={`p-4 ${account.isActive ? 'border-primary-300 bg-primary-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Account Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            account.isActive 
              ? 'bg-primary-200 text-primary-700' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            <Icons.User className="h-5 w-5" />
          </div>

          {/* Account Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold truncate ${
                account.isActive ? 'text-primary-900' : 'text-gray-900'
              }`}>
                {account.name}
              </h3>
              {account.isActive && (
                <Badge variant="primary" size="sm">
                  Ativa
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500 truncate">
                {formatAddress(account.address)}
              </p>
              <Tooltip content={copied ? "Copiado!" : "Copiar endereço"}>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {copied ? (
                    <Icons.Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Icons.Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </Tooltip>
            </div>
            
            <p className="text-xs text-gray-400">
              Criada em {new Date(account.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {!account.isActive && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSetActive(account.id)}
            >
              Ativar
            </Button>
          )}
          
          <Tooltip content="Renomear conta">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRename(account)}
            >
              <Icons.Edit className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Remover conta">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(account)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icons.Trash className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  )
}

export const AccountManager: FC = () => {
  const { 
    accounts, 
    createAccount, 
    renameAccount, 
    removeAccount, 
    setActiveAccount,
    formatAddress,
    copyToClipboard,
    error,
    clearError
  } = useWallet()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(null)

  const handleCreateAccount = async (name: string) => {
    await createAccount(name)
  }

  const handleRenameAccount = async (accountId: string, newName: string) => {
    await renameAccount(accountId, newName)
  }

  const handleDeleteAccount = async (accountId: string) => {
    await removeAccount(accountId)
  }

  const handleSetActiveAccount = async (accountId: string) => {
    await setActiveAccount(accountId)
  }

  const openRenameModal = (account: WalletAccount) => {
    setSelectedAccount(account)
    setShowRenameModal(true)
  }

  const openDeleteModal = (account: WalletAccount) => {
    setSelectedAccount(account)
    setShowDeleteModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Gerenciar Contas
          </h2>
          <p className="text-sm text-gray-600">
            Crie, renomeie e gerencie suas contas da wallet
          </p>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)}>
          <Icons.Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icons.AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearError}
              className="text-red-600 hover:text-red-700"
            >
              <Icons.X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Account List */}
      <div className="space-y-3">
        {accounts.length === 0 ? (
          <Card className="p-8 text-center">
            <Icons.User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="font-medium text-gray-900 mb-2">
              Nenhuma conta encontrada
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Crie sua primeira conta para começar a usar a wallet
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Icons.Plus className="h-4 w-4 mr-2" />
              Criar Primeira Conta
            </Button>
          </Card>
        ) : (
          accounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              onSetActive={handleSetActiveAccount}
              onRename={openRenameModal}
              onDelete={openDeleteModal}
              formatAddress={formatAddress}
              copyToClipboard={copyToClipboard}
            />
          ))
        )}
      </div>

      {/* Stats */}
      {accounts.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total de contas:</span>
            <span className="font-medium text-gray-900">{accounts.length}</span>
          </div>
        </Card>
      )}

      {/* Modals */}
      <CreateAccountModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAccount}
      />

      <RenameAccountModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false)
          setSelectedAccount(null)
        }}
        account={selectedAccount}
        onSubmit={handleRenameAccount}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedAccount(null)
        }}
        account={selectedAccount}
        onSubmit={handleDeleteAccount}
      />
    </div>
  )
}