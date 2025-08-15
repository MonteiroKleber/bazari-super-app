// src/pages/dao/DaoHome.tsx

import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useDAO, useTreasury } from '@features/dao/hooks/useDAO'
import { ProposalCard, TreasuryWidget } from '@features/dao/components'
import { ProposalState } from '@features/dao/types/dao.types'

export const DaoHome: FC = () => {
  const { proposals, stats, loading, error } = useDAO()
  const { balance, history } = useTreasury()

  const activeProposals = proposals.filter(p => p.state === ProposalState.ACTIVE)
  const recentProposals = proposals
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">❌ Erro ao carregar dados da DAO</div>
          <div className="text-sm text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Governança Descentralizada
        </h1>
        <p className="text-gray-600">
          Participe das decisões da Bazari DAO com seus tokens BZR
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {stats.totalProposals}
          </div>
          <div className="text-sm text-gray-600">Total de Propostas</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stats.activeProposals}
          </div>
          <div className="text-sm text-gray-600">Propostas Ativas</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {stats.totalVoters}
          </div>
          <div className="text-sm text-gray-600">Votantes Únicos</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {stats.averageParticipation.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Participação Média</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Proposals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Propostas Ativas ({activeProposals.length})
              </h2>
              <Link
                to="/dao/proposals"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Ver todas →
              </Link>
            </div>
            
            {activeProposals.length > 0 ? (
              <div className="space-y-4">
                {activeProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    canVote={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">📋</div>
                <div className="text-gray-600">Nenhuma proposta ativa no momento</div>
              </div>
            )}
          </div>

          {/* Recent Proposals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Propostas Recentes
              </h2>
              <Link
                to="/dao/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Nova Proposta
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  canVote={proposal.state === ProposalState.ACTIVE}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Treasury Widget */}
          <TreasuryWidget 
            balance={balance} 
            recentEntries={history.slice(0, 3)} 
          />

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Link
                to="/dao/create"
                className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
              >
                Criar Proposta
              </Link>
              <Link
                to="/dao/proposals"
                className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors"
              >
                Ver Propostas
              </Link>
              <Link
                to="/dao/votes"
                className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors"
              >
                Meus Votos
              </Link>
              <Link
                to="/dao/treasury"
                className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors"
              >
                Ver Tesouro
              </Link>
            </div>
          </div>

          {/* Voting Power */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Seu Poder de Voto</h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                25,000
              </div>
              <div className="text-sm text-gray-600 mb-3">BZR</div>
              <div className="text-xs text-gray-500">
                Representa 2.5% do total em circulação
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
