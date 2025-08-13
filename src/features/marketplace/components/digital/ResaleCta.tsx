import { FC } from 'react'
import { useTranslation } from '@shared/hooks/useTranslation'
import { Button } from '@shared/ui/Button'
import { Icons } from '@shared/ui/Icons'

interface ResaleCtaProps {
  tokenId: string
  suggestedPrice: number
  className?: string
}

export const ResaleCta: FC<ResaleCtaProps> = ({ 
  tokenId, 
  suggestedPrice, 
  className = '' 
}) => {
  const { t } = useTranslation()
  
  const handleResale = () => {
    // Deep-link para DEX com parâmetros
    const deepLink = `app://dex/listar?tokenId=${encodeURIComponent(tokenId)}&suggestedPrice=${suggestedPrice}`
    
    // Mock: abrir em nova aba (seria o deep-link real)
    window.open(deepLink, '_blank')
    
    // TODO: Integrar com DEX real quando disponível
  }
  
  return (
    <Button 
      variant="outline" 
      onClick={handleResale} 
      className={`${className}`}
    >
      <Icons.TrendingUp className="w-4 h-4 mr-2" />
      {t('marketplaceDigital', 'pdp.resell')}
    </Button>
  )
}