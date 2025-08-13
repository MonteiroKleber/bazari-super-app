// src/features/marketplace/components/digital/LicensePill.tsx
import { FC } from 'react'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

interface LicensePillProps {
  license: 'lifetime' | 'days30' | 'days90'
  className?: string
}

export const LicensePill: FC<LicensePillProps> = ({ license, className = '' }) => {
  const variants = {
    lifetime: 'bg-purple-100 text-purple-800 border-purple-200',
    days30: 'bg-orange-100 text-orange-800 border-orange-200', 
    days90: 'bg-blue-100 text-blue-800 border-blue-200'
  }
  
  const labels = {
    lifetime: 'Vitalícia',
    days30: '30 dias',
    days90: '90 dias'
  }
  
  const icons = {
    lifetime: Icons.Infinity,
    days30: Icons.Clock,
    days90: Icons.Calendar
  }
  
  const IconComponent = icons[license]
  
  return (
    <Badge className={`${variants[license]} ${className}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {labels[license]}
    </Badge>
  )
}