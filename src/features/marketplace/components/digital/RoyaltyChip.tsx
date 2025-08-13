// src/features/marketplace/components/digital/RoyaltyChip.tsx
import { FC } from 'react'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

interface RoyaltyChipProps {
  percentage: number
  className?: string
}

export const RoyaltyChip: FC<RoyaltyChipProps> = ({ percentage, className = '' }) => {
  return (
    <Badge 
      variant="outline" 
      className={`bg-green-50 text-green-700 border-green-200 ${className}`}
    >
      <Icons.Percent className="w-3 h-3 mr-1" />
      Royalties {percentage}%
    </Badge>
  )
}