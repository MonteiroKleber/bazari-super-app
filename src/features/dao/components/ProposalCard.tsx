// src/features/dao/components/ProposalCard.tsx

import { FC } from 'react'
import { Proposal, ProposalState, VoteOption } from '../types/dao.types'

interface ProposalCardProps {
  proposal: Proposal
  onVote?: (option: VoteOption) => void
  onExecute?: () => void
  canVote?: boolean
  canExecute?: boolean
}

export const ProposalCard: FC<ProposalCardProps> = ({
  proposal,
  onVote,
  onExecute,
  canVote = false,
  canExecute = false
}) => {
  const getStateColor = (state: ProposalState): string => {
    switch (state) {
      case ProposalState.DRAFT:
        return 'bg-gray-100 text-gray-800'
      case ProposalState.ACTIVE:
        return 'bg-blue-100 text-blue-800'
      case ProposalState.SUCCEEDED:
        return 'bg-green-100 text-green-800'
      case ProposalState.DEFEATED:
        return 'bg-red-100 text-red-800'
      case ProposalState.QUEUED:
        return 'bg-yellow-100 text-yellow-800'
      case ProposalState.EXECUTED:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStateText = (state: ProposalState): string => {
    switch (state) {
      case ProposalState.DRAFT:
        return 'Rascunho'
      case ProposalState.ACTIVE:
        return 'Ativa'
      case ProposalState.SUCCEEDED:
        return 'Aprovada'
      case ProposalState.DEFEATED:
        return 'Rejeitada'
      case ProposalState.QUEUED:
        return 'Na Fila'
      case ProposalState.EXECUTED:
        return 'Executada'
      default:
        return 'Desconhecido'
    }
  }

  const formatTimeRemaining = (endTime: number): string => {
    const now = Date.now()
    const remaining = endTime - now
    
    if (remaining <= 0) return 'Votação encerrada'
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h restantes`
    if (hours > 0) return `${hours}h ${minutes}m restantes`
    return `${minutes}m restantes`
  }

  const getQuorumProgress = (): { percentage: number; achieved: boolean } => {
    // TODO: Integrar com snapshot real
    const totalZari = 100000 // Mock
    const currentParticipation = (proposal.totalVotes / totalZari) * 100
    const achieved = currentParticipation >= proposal.quorumRequired
    
    return {
      percentage: Math.min(currentParticipation, 100),
      achieved
    }
  }

  const quorum = getQuorumProgress()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStateColor(proposal.state)}`}>
              {getStateText(proposal.state)}
            </span>
            <span className="text-sm text-gray-500">#{proposal.id.split('-')[1]}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{proposal.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{proposal.description}</p>
        </div>
      </div>

      {/* Progress de Votação */}
      {proposal.state === ProposalState.ACTIVE && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso da Votação</span>
            <span>{formatTimeRemaining(proposal.endTime)}</span>
          </div>
          
          {/* Barra de Quórum */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Quórum: {proposal.quorumRequired}%</span>
              <span>{quorum.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  quorum.achieved ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${quorum.percentage}%` }}
              />
            </div>
          </div>

          {/* Resultado dos Votos */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-green-600">
                {proposal.forVotes.toLocaleString()}
              </div>
              <div className="text-gray-500">A favor</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-red-600">
                {proposal.againstVotes.toLocaleString()}
              </div>
              <div className="text-gray-500">Contra</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-600">
                {proposal.abstainVotes.toLocaleString()}
              </div>
              <div className="text-gray-500">Abstenção</div>
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Por: {proposal.proposer.slice(0, 8)}...{proposal.proposer.slice(-6)}
        </div>
        
        <div className="flex gap-2">
          {proposal.state === ProposalState.ACTIVE && canVote && onVote && (
            <div className="flex gap-1">
              <button
                onClick={() => onVote(VoteOption.FOR)}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                A favor
              </button>
              <button
                onClick={() => onVote(VoteOption.AGAINST)}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Contra
              </button>
              <button
                onClick={() => onVote(VoteOption.ABSTAIN)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Abstenção
              </button>
            </div>
          )}
          
          {proposal.state === ProposalState.QUEUED && canExecute && onExecute && (
            <button
              onClick={onExecute}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Executar
            </button>
          )}
          
          <button className="px-4 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  )
}



