// src/features/work/components/MilestoneList.tsx
import React from 'react';
import type { Milestone } from '../entities/workTypes';

interface MilestoneListProps {
  milestones: Milestone[];
  canRelease?: boolean;
  onReleaseMilestone?: (milestoneId: string, amount: number) => void;
  className?: string;
}

export const MilestoneList: React.FC<MilestoneListProps> = ({
  milestones,
  canRelease = false,
  onReleaseMilestone,
  className = ''
}) => {
  const formatBZR = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalAmount = milestones.reduce((sum, m) => sum + m.amountBZR, 0);
  const completedAmount = milestones.filter(m => m.done).reduce((sum, m) => sum + m.amountBZR, 0);
  const completedCount = milestones.filter(m => m.done).length;
  const progressPercent = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  if (milestones.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum milestone</h3>
        <p className="mt-1 text-sm text-gray-500">
          Este projeto não possui milestones definidos.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Milestones ({completedCount}/{milestones.length})
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-500">Valor total</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatBZR(totalAmount)} BZR
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progresso</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>{formatBZR(completedAmount)} BZR liberados</span>
            <span>{formatBZR(totalAmount - completedAmount)} BZR restantes</span>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="divide-y divide-gray-200">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`px-6 py-4 transition-colors duration-200 ${
              milestone.done ? 'bg-green-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {milestone.done ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-sm font-medium ${
                    milestone.done ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {milestone.title}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${
                      milestone.done ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {formatBZR(milestone.amountBZR)} BZR
                    </span>
                    {milestone.done && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Concluído
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!milestone.done && canRelease && (
                  <div className="mt-3">
                    <button
                      onClick={() => onReleaseMilestone?.(milestone.id, milestone.amountBZR)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Liberar pagamento
                    </button>
                  </div>
                )}

                {milestone.done && (
                  <div className="mt-2 text-xs text-green-600">
                    <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Pagamento liberado
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                {completedCount} concluídos
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span className="text-gray-600">
                {milestones.length - completedCount} pendentes
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-gray-600">
              {formatBZR(completedAmount)}/{formatBZR(totalAmount)} BZR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};