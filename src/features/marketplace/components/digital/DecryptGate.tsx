import { FC, useState } from 'react'
import { useTranslation } from '@shared/hooks/useTranslation'
import { Button } from '@shared/ui/Button'
import { Icons } from '@shared/ui/Icons'

interface DecryptGateProps {
  onAccess: () => void
  children?: React.ReactNode
  productName?: string
}

export const DecryptGate: FC<DecryptGateProps> = ({ 
  onAccess, 
  children, 
  productName = 'conteúdo' 
}) => {
  const { t } = useTranslation()
  const [isVerifying, setIsVerifying] = useState(false)
  
  const handleAccess = async () => {
    setIsVerifying(true)
    
    // Simular verificação da carteira
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsVerifying(false)
    onAccess()
  }
  
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
      <div className="max-w-sm mx-auto">
        
        {/* Icon */}
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.Lock className="w-8 h-8 text-primary-600" />
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Conteúdo Protegido
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-6">
          Este {productName} está protegido por criptografia. 
          Verifique sua carteira para acessar o conteúdo.
        </p>
        
        {/* Mock Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-center">
            <Icons.CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-green-700 font-medium">
              Carteira verificada (mock) - acesso liberado
            </span>
          </div>
        </div>
        
        {/* Access Button */}
        <Button 
          onClick={handleAccess} 
          loading={isVerifying}
          className="w-full"
          size="lg"
        >
          {isVerifying ? (
            <>
              <Icons.Loader className="w-5 h-5 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Icons.Unlock className="w-5 h-5 mr-2" />
              {t('marketplaceDigital', 'pdp.accessNow')}
            </>
          )}
        </Button>
        
        {/* Security Note */}
        <p className="text-xs text-gray-500 mt-4">
          🔒 Seus dados estão protegidos por criptografia de ponta a ponta
        </p>
        
      </div>
    </div>
  )
}