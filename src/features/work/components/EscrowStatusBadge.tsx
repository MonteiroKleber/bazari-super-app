// src/features/work/components/EscrowStatusBadge.tsx
import React from 'react';
import type { EscrowState } from '../entities/workTypes';
import { ESCROW_STATE_LABELS } from '../entities/workTypes';

interface EscrowStatusBadgeProps {
  state: EscrowState;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const EscrowStatusBadge: React.FC<EscrowStatusBadgeProps> = ({
  state,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getStateConfig = (state: EscrowState) => {
    switch (state) {
      case 'CREATED':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '📄',
          description: 'Escrow criado, aguardando financiamento'
        };
      case 'FUNDED':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '💰',
          description: 'Escrow financiado, pronto para iniciar'
        };
      case 'IN_PROGRESS':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⚡',
          description: 'Trabalho em progresso'
        };
      case 'SUBMITTED':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: '📤',
          description: 'Trabalho submetido, aguardando aprovação'
        };
      case 'DISPUTED':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: '⚖️',
          description: 'Em disputa, aguardando resolução'
        };
      case 'RELEASED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅',
          description: 'Trabalho aprovado e pagamento liberado'
        };
      case 'REFUNDED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '↩️',
          description: 'Pagamento reembolsado'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '❓',
          description: 'Status desconhecido'
        };
    }
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getStateConfig(state);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`inline-flex items-center gap-1 font-medium rounded-full border ${config.color} ${sizeClasses} ${className}`}>
      {showIcon && (
        <span className="leading-none">
          {config.icon}
        </span>
      )}
      <span>
        {ESCROW_STATE_LABELS[state]}
      </span>
    </div>
  );
};