// src/pages/dao/DaoVotes.tsx

import { FC, useState } from 'react'
import { useDAO } from '@features/dao/hooks/useDAO'
import { VoteOption, ProposalState } from '@features/dao/types/dao.types'

export const DaoVotes: FC = () => {
  const { proposals, votes, getUserVotes, getVotingPower, loading } = useDAO()
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // TODO: Integrar com wallet para obter endereço real
  const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
  
  const userVotes = getUserVotes(mockUserAddress)
  const votingPower = getVotingPower(mockUserAddress)

  const getFilteredVotes = () => {
    switch (filter) {
      case 'active':
        return userVotes.filter(vote => {
          const proposal = proposals.find(p => p.id === vote.proposalId)
          return proposal?.state === ProposalState.ACTIVE
        })
      case 'completed':
        return userVotes.filter(vote => {
          const proposal = proposals.find(p => p.id === vote.proposalId)
          return proposal?.state === ProposalState.SUCCEEDED || 
                 proposal?.state === ProposalState.DEFEATED ||
                 proposal?.state === ProposalState.EXECUTED
        })
      default:
        return userVotes
    }
  }

  const filteredVotes = getFilteredVotes()

  const getVoteOptionText = (option: VoteOption): string => {
    switch (option) {
      case VoteOption.FOR: return 'A favor'
      case VoteOption.AGAINST: return 'Contra'
      case VoteOption.ABSTAIN: return 'Abstenção'
    }
  }

  const getVoteOptionColor = (option: VoteOption): string => {
    switch (option) {
      case VoteOption.FOR: return 'bg-green-100 text-green-800'
      case VoteOption.AGAINST: return 'bg-red-100 text-red-800'
      case VoteOption.ABSTAIN: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Meus Votos
        </h1>
        <p className="text-gray-600">
          Histórico de participação na governança da Bazari DAO
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'active', label: 'Ativos' },
                { key: 'completed', label: 'Finalizados' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {label} ({key === 'all' ? userVotes.length : 
                          key === 'active' ? userVotes.filter(vote => {
                            const proposal = proposals.find(p => p.id === vote.proposalId)
                            return proposal?.state === ProposalState.ACTIVE
                          }).length :
                          userVotes.filter(vote => {
                            const proposal = proposals.find(p => p.id === vote.proposalId)
                            return proposal?.state === ProposalState.SUCCEEDED || 
                                   proposal?.state === ProposalState.DEFEATED ||
                                   proposal?.state === ProposalState.EXECUTED
                          }).length})
                </button>
              ))}
            </div>
          </div>

          {/* Votes List */}
          {filteredVotes.length > 0 ? (
            <div className="space-y-4">
              {filteredVotes.map((vote) => {
                const proposal = proposals.find(p => p.id === vote.proposalId)
                if (!proposal) return null

                return (
                  <div key={vote.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {proposal.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {proposal.description}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVoteOptionColor(vote.option)}`}>
                        {getVoteOptionText(vote.option)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Proposta</div>
                        <div className="font-medium">#{proposal.id.split('-')[1]}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Peso do voto</div>
                        <div className="font-medium">{vote.weight.toLocaleString()} ZARI</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Data do voto</div>
                        <div className="font-medium">{formatDate(vote.timestamp)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Status</div>
                        <div className={`font-medium ${
                          proposal.state === ProposalState.SUCCEEDED ? 'text-green-600' :
                          proposal.state === ProposalState.DEFEATED ? 'text-red-600' :
                          proposal.state === ProposalState.EXECUTED ? 'text-purple-600' :
                          'text-blue-600'
                        }`}>
                          {proposal.state === ProposalState.ACTIVE ? 'Votação ativa' :
                           proposal.state === ProposalState.SUCCEEDED ? 'Aprovada' :
                           proposal.state === ProposalState.DEFEATED ? 'Rejeitada' :
                           proposal.state === ProposalState.EXECUTED ? 'Executada' :
                           'Pendente'}
                        </div>
                      </div>
                    </div>

                    {vote.txHash && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Tx: <span className="font-mono">{vote.txHash}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum voto encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? 'Você ainda não votou em nenhuma proposta.'
                  : `Não há votos na categoria "${filter}".`
                }
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Ver Propostas Ativas
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Voting Power */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Poder de Voto</h3>
            {votingPower ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {votingPower.balance.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-2">ZARI</div>
                <div className="text-xs text-gray-500 mb-4">
                  {votingPower.percentage.toFixed(3)}% do total
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-purple-900">
                    Ranking #{votingPower.rank}
                  </div>
                  <div className="text-xs text-purple-700">
                    Entre todos os holders
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-sm">Sem poder de voto</div>
                <div className="text-xs mt-1">Você precisa de tokens ZARI</div>
              </div>
            )}
          </div>

          {/* Participation Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de votos</span>
                <span className="font-medium">{userVotes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">A favor</span>
                <span className="font-medium text-green-600">
                  {userVotes.filter(v => v.option === VoteOption.FOR).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Contra</span>
                <span className="font-medium text-red-600">
                  {userVotes.filter(v => v.option === VoteOption.AGAINST).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Abstenções</span>
                <span className="font-medium text-gray-600">
                  {userVotes.filter(v => v.option === VoteOption.ABSTAIN).length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Atividade Recente</h3>
            {userVotes.slice(0, 3).map((vote) => {
              const proposal = proposals.find(p => p.id === vote.proposalId)
              return (
                <div key={vote.id} className="mb-3 last:mb-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {proposal?.title || 'Proposta'}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{getVoteOptionText(vote.option)}</span>
                    <span>{formatDate(vote.timestamp)}</span>
                  </div>
                </div>
              )
            })}
            
            {userVotes.length === 0 && (
              <div className="text-sm text-gray-500">
                Nenhuma atividade recente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
