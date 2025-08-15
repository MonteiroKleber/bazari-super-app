// src/features/work/components/ProposalCard.tsx
import React from 'react';
import type { Proposal } from '../entities/workTypes';
import { PROPOSAL_STATUS_LABELS } from '../entities/workTypes';

interface ProposalCardProps {
  proposal: Proposal;
  isOwner?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onWithdraw?: (id: string) => void;
  className?: string;
}

export const ProposalCard: React.FC<ProposalCardProps> = React.memo(({
  proposal,
  isOwner = false,
  onAccept,
  onReject,
  onWithdraw,
  className = ''
}) => {
  const formatBZR = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const timeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return 'Agora mesmo';
  };

  const totalMilestoneAmount = proposal.milestones.reduce((sum, m) => sum + m.amountBZR, 0);
  const milestoneAmountMatches = totalMilestoneAmount === proposal.bidBZR;

  const canAccept = isOwner && proposal.status === 'PENDING';
  const canReject = isOwner && proposal.status === 'PENDING';
  const canWithdraw = !isOwner && proposal.status === 'PENDING';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {proposal.freelancerAddress.slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {proposal.freelancerAddress.slice(0, 12)}...{proposal.freelancerAddress.slice(-4)}
              </div>
              <div className="text-sm text-gray-500">
                {timeAgo(proposal.createdAt)}
              </div>
            </div>
          </div>
          
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(proposal.status)}`}>
            {PROPOSAL_STATUS_LABELS[proposal.status]}
          </span>
        </div>

        {/* Bid Amount */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Proposta:</span>
            <span className="text-xl font-bold text-green-600">
              {formatBZR(proposal.bidBZR)} BZR
            </span>
          </div>
          
          {!milestoneAmountMatches && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Soma dos milestones ({formatBZR(totalMilestoneAmount)} BZR) diferente da proposta
            </div>
          )}
        </div>

        {/* Cover Letter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Carta de apresentação:</h4>
          <p className="text-sm text-gray-600 line-clamp-4">
            {proposal.coverLetter}
          </p>
        </div>

        {/* Milestones */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Milestones ({proposal.milestones.length})
          </h4>
          <div className="space-y-2">
            {proposal.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {index + 1}. {milestone.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {formatBZR(milestone.amountBZR)} BZR
                  </span>
                  {milestone.done && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-right">
            <span className="text-sm text-gray-500">
              Total: <span className="font-semibold">{formatBZR(totalMilestoneAmount)} BZR</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        {(canAccept || canReject || canWithdraw) && (
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            {canAccept && (
              <button
                onClick={() => onAccept?.(proposal.id)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Aceitar
              </button>
            )}

            {canReject && (
              <button
                onClick={() => onReject?.(proposal.id)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Rejeitar
              </button>
            )}

            {canWithdraw && (
              <button
                onClick={() => onWithdraw?.(proposal.id)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Retirar
              </button>
            )}
          </div>
        )}

        {/* Read-only info for accepted/rejected proposals */}
        {proposal.status !== 'PENDING' && (
          <div className="pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 text-center">
              {proposal.status === 'ACCEPTED' && '✅ Proposta aceita'}
              {proposal.status === 'REJECTED' && '❌ Proposta rejeitada'}
              {proposal.status === 'WITHDRAWN' && '↩️ Proposta retirada'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ProposalCard.displayName = 'ProposalCard';