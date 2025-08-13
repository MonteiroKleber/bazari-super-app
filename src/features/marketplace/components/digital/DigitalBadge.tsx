// src/features/marketplace/components/digital/DigitalBadge.tsx
import { FC } from 'react'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

interface DigitalBadgeProps {
  className?: string
}

export const DigitalBadge: FC<DigitalBadgeProps> = ({ className = '' }) => {
  return (
    <Badge 
      variant="secondary" 
      className={`bg-blue-100 text-blue-800 border-blue-200 ${className}`}
    >
      <Icons.Zap className="w-3 h-3 mr-1" />
      Tokenizado
    </Badge>
  )
}