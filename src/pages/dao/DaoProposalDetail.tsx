// src/pages/dao/DaoProposalDetail.tsx

import { FC } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useProposal } from '@features/dao/hooks/useDAO'
import { VoteBreakdown } from '@features/dao/components'
import { ProposalState, VoteOption } from '@features/dao/types/dao.types'

export const DaoProposalDetail: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { proposal, votes, castVote, executeProposal, loading, error } = useProposal(id!)

  if (!id) {
    return <Navigate to="/dao/proposals" replace />
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">❌ Proposta não encontrada</div>
          <Link
            to="/dao/proposals"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Voltar para propostas
          </Link>
        </div>
      </div>
    )
  }

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
      case ProposalState.DRAFT: return 'Rascunho'
      case ProposalState.ACTIVE: return 'Ativa'
      case ProposalState.SUCCEEDED: return 'Aprovada'
      case ProposalState.DEFEATED: return 'Rejeitada'
      case ProposalState.QUEUED: return 'Na Fila'
      case ProposalState.EXECUTED: return 'Executada'
      default: return 'Desconhecido'
    }
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/dao" className="hover:text-gray-700">DAO</Link>
        <span>→</span>
        <Link to="/dao/proposals" className="hover:text-gray-700">Propostas</Link>
        <span>→</span>
        <span className="text-gray-900">#{proposal.id.split('-')[1]}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStateColor(proposal.state)}`}>
                  {getStateText(proposal.state)}
                </span>
                <span className="text-sm text-gray-500">
                  Proposta #{proposal.id.split('-')[1]}
                </span>
              </div>
              {proposal.state === ProposalState.QUEUED && (
                <button
                  onClick={() => executeProposal()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Executar Proposta
                </button>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {proposal.title}
            </h1>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Proposta por:</span>
                <div className="font-mono">
                  {proposal.proposer.slice(0, 8)}...{proposal.proposer.slice(-6)}
                </div>
              </div>
              <div>
                <span className="font-medium">Criada em:</span>
                <div>{formatDate(proposal.createdAt)}</div>
              </div>
              <div>
                <span className="font-medium">Início da votação:</span>
                <div>{formatDate(proposal.startTime)}</div>
              </div>
              <div>
                <span className="font-medium">Fim da votação:</span>
                <div>{formatDate(proposal.endTime)}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap">{proposal.description}</p>
            </div>
          </div>

          {/* Actions */}
          {proposal.actions.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações</h2>
              <div className="space-y-3">
                {proposal.actions.map((action, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="font-medium text-gray-900 mb-1">
                      {action.type === 'transfer' ? 'Transferência' :
                       action.type === 'parameter_change' ? 'Mudança de Parâmetro' :
                       'Chamada de Contrato'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {action.description}
                    </div>
                    {action.value && (
                      <div className="text-sm text-gray-800 mt-1">
                        Valor: {action.value.toLocaleString()} BZR
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Voting */}
          {proposal.state === ProposalState.ACTIVE && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Votar</h3>
              <div className="space-y-3">
                <button
                  onClick={() => castVote(VoteOption.FOR)}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  ✓ Votar A Favor
                </button>
                <button
                  onClick={() => castVote(VoteOption.AGAINST)}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  ✗ Votar Contra
                </button>
                <button
                  onClick={() => castVote(VoteOption.ABSTAIN)}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  ~ Abstenção
                </button>
              </div>
            </div>
          )}

          {/* Vote Breakdown */}
          <VoteBreakdown proposal={proposal} votes={votes} />

          {/* Proposal Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Informações</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">
                  {proposal.type === 'treasury_withdrawal' ? 'Retirada do Tesouro' :
                   proposal.type === 'parameter_change' ? 'Mudança de Parâmetro' :
                   proposal.type === 'protocol_upgrade' ? 'Upgrade do Protocolo' :
                   'Proposta Geral'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Depósito:</span>
                <span className="font-medium">{proposal.deposit} ZARI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quórum necessário:</span>
                <span className="font-medium">{proposal.quorumRequired}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Threshold:</span>
                <span className="font-medium">{proposal.thresholdRequired}%</span>
              </div>
              {proposal.executedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Executada em:</span>
                  <span className="font-medium">{formatDate(proposal.executedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}