// src/features/work/pages/work/WorkProposals.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWork } from '../../hooks/useWork';
import type { Proposal } from '../../entities/workTypes';
import { PROPOSAL_STATUS_LABELS } from '../../entities/workTypes';

export const WorkProposals: React.FC = () => {
  const {
    proposals,
    proposalsLoading,
    proposalsError,
    loadProposalsByFreelancer,
    withdrawProposal
  } = useWork();

  // Mock current user (TODO: Replace with actual auth context)
  const currentUserAddress = '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y';

  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    loadProposalsByFreelancer(currentUserAddress);
  }, [loadProposalsByFreelancer, currentUserAddress]);

  const formatBZR = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  const filteredProposals = proposals.filter(proposal => {
    if (filter === 'all') return true;
    return proposal.status.toLowerCase() === filter;
  });

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'PENDING').length,
    accepted: proposals.filter(p => p.status === 'ACCEPTED').length,
    rejected: proposals.filter(p => p.status === 'REJECTED').length,
    totalValue: proposals.reduce((sum, p) => sum + p.bidBZR, 0),
    acceptedValue: proposals.filter(p => p.status === 'ACCEPTED').reduce((sum, p) => sum + p.bidBZR, 0)
  };

  const handleWithdraw = async (proposalId: string) => {
    if (window.confirm('Tem certeza que deseja retirar esta proposta? Esta ação não pode ser desfeita.')) {
      try {
        await withdrawProposal(proposalId);
      } catch (error) {
        console.error('Error withdrawing proposal:', error);
        alert('Erro ao retirar proposta. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Minhas Propostas
              </h1>
              <p className="text-sm text-gray-600">
                Gerencie suas propostas enviadas para projetos
              </p>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar Projetos
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Propostas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aceitas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.accepted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Aceito</p>
                <p className="text-2xl font-semibold text-gray-900">{formatBZR(stats.acceptedValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Filtrar Propostas
              </h2>
              <div className="flex rounded-md shadow-sm">
                {[
                  { key: 'all', label: 'Todas', count: stats.total },
                  { key: 'pending', label: 'Pendentes', count: stats.pending },
                  { key: 'accepted', label: 'Aceitas', count: stats.accepted },
                  { key: 'rejected', label: 'Rejeitadas', count: stats.rejected }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-4 py-2 text-sm font-medium border first:rounded-l-md last:rounded-r-md first:border-r-0 last:border-l-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ${
                      filter === filterOption.key
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {filterOption.label} ({filterOption.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {proposalsLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando propostas...</p>
          </div>
        )}

        {/* Error State */}
        {proposalsError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao carregar propostas
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {proposalsError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!proposalsLoading && filteredProposals.length === 0 && !proposalsError && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === 'all' ? 'Nenhuma proposta ainda' : `Nenhuma proposta ${filter === 'pending' ? 'pendente' : filter === 'accepted' ? 'aceita' : 'rejeitada'}`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Comece explorando projetos e enviando suas primeiras propostas.'
                : 'Tente ajustar o filtro ou explore novos projetos.'
              }
            </p>
            <div className="mt-6">
              <Link
                to="/work"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explorar Projetos
              </Link>
            </div>
          </div>
        )}

        {/* Proposals List */}
        {filteredProposals.length > 0 && (
          <div className="space-y-6">
            {filteredProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(proposal.status)}`}>
                          {PROPOSAL_STATUS_LABELS[proposal.status]}
                        </span>
                        <span className="text-sm text-gray-500">
                          {timeAgo(proposal.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Projeto ID: {proposal.projectId}
                      </h3>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        {formatBZR(proposal.bidBZR)} BZR
                      </div>
                      <div className="text-sm text-gray-500">Proposta</div>
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Carta de apresentação:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {proposal.coverLetter}
                    </p>
                  </div>

                  {/* Milestones Summary */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Milestones ({proposal.milestones.length})
                      </span>
                      <span className="text-sm text-gray-600">
                        Total: {formatBZR(proposal.milestones.reduce((sum, m) => sum + m.amountBZR, 0))} BZR
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {proposal.milestones.slice(0, 3).map((milestone, index) => (
                        <span key={milestone.id} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {milestone.title} ({formatBZR(milestone.amountBZR)} BZR)
                        </span>
                      ))}
                      {proposal.milestones.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                          +{proposal.milestones.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <Link
                        to={`/work/p/projeto-${proposal.projectId}`} // TODO: Use actual project slug
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Projeto
                      </Link>

                      {proposal.status === 'ACCEPTED' && (
                        <Link
                          to="/work/me/freelancer"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Ver Escrow
                        </Link>
                      )}
                    </div>

                    {proposal.status === 'PENDING' && (
                      <button
                        onClick={() => handleWithdraw(proposal.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Retirar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};