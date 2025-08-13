import { FC } from 'react'
import { useTranslation } from '@shared/hooks/useTranslation'
import { Modal } from '@shared/ui/Modal'
import { Button } from '@shared/ui/Button'
import { Icons } from '@shared/ui/Icons'

interface OnchainProofModalProps {
  isOpen: boolean
  onClose: () => void
  onchain: {
    tokenId: string
    txHash?: string
    chain: string
  }
}

export const OnchainProofModal: FC<OnchainProofModalProps> = ({ 
  isOpen, 
  onClose, 
  onchain 
}) => {
  const { t } = useTranslation()
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Show toast notification
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('marketplaceDigital', 'pdp.onchainProof')}>
      <div className="space-y-6">
        
        {/* Token ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token ID
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
              {onchain.tokenId}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(onchain.tokenId)}
            >
              <Icons.Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Blockchain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blockchain
          </label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">{onchain.chain}</span>
            <div className="flex items-center">
              <Icons.CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">Verificado</span>
            </div>
          </div>
        </div>
        
        {/* Transaction Hash */}
        {onchain.txHash && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Hash
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-xs break-all">
                {onchain.txHash}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(onchain.txHash!)}
              >
                <Icons.Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.open(`https://bazari-explorer.com/token/${onchain.tokenId}`, '_blank')}
          >
            <Icons.ExternalLink className="w-4 h-4 mr-2" />
            Ver Token no Explorer
          </Button>
          
          {onchain.txHash && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open(`https://bazari-explorer.com/tx/${onchain.txHash}`, '_blank')}
            >
              <Icons.ExternalLink className="w-4 h-4 mr-2" />
              Ver Transação
            </Button>
          )}
        </div>
        
        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Icons.Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Prova de Autenticidade</p>
              <p>
                Este produto digital está registrado na blockchain BazariChain, 
                garantindo sua autenticidade e propriedade única.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </Modal>
  )
}