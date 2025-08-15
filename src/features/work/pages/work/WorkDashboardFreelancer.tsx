// src/features/work/pages/work/WorkDashboardFreelancer.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWork } from '../../hooks/useWork';
import { EscrowStatusBadge } from '../../components/EscrowStatusBadge';
import { SubmitWorkModal } from '../../components/SubmitWorkModal';
import { DisputeDialog } from '../../components/DisputeDialog';
import { PROPOSAL_STATUS_LABELS } from '../../entities/workTypes';
import type { Proposal, Escrow } from '../../entities/workTypes';

export const WorkDashboardFreelancer: React.FC = () => {
  const {
    proposals,
    escrows,
    proposalsLoading,
    escrowsLoading,
    proposalsError,
    escrowsError,
    loadProposalsByFreelancer,
    loadEscrowsByUser,
    submitWork,
    disputeEscrow
  } = useWork();

  // Mock current user (TODO: Replace with actual auth context)
  const currentUserAddress = '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y';

  const [activeTab, setActiveTab] = useState<'proposals' | 'projects' | 'escrows'>('proposals');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null);

  useEffect(() => {
    loadProposalsByFreelancer(currentUserAddress);
    loadEscrowsByUser(currentUserAddress);
  }, [loadProposalsByFreelancer, loadEscrowsByUser, currentUserAddress]);

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

  // Filter data by current user
  const myProposals = proposals.filter(p => p.freelancerAddress === currentUserAddress);
  const myEscrows = escrows.filter(e => e.freelancerAddress === currentUserAddress);
  const acceptedProposals = myProposals.filter(p => p.status === 'ACCEPTED');

  // Calculate stats
  const stats = {
    totalProposals: myProposals.length,
    pendingProposals: myProposals.filter(p => p.status === 'PENDING').length,
    acceptedProposals: acceptedProposals.length,
    activeProjects: myEscrows.filter(e => ['FUNDED', 'IN_PROGRESS', 'SUBMITTED'].includes(e.state)).length,
    totalEarnings: myEscrows.reduce((sum, e) => sum + e.amountReleasedBZR, 0),
    pendingEarnings: myEscrows.reduce((sum, e) => sum + (e.amountFundedBZR - e.amountReleasedBZR), 0),
    proposalValue: myProposals.filter(p => p.status === 'ACCEPTED').reduce((sum, p) => sum + p.bidBZR, 0)
  };

  const getProposalStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitWork = async (data: { description: string; files?: File[] }) => {
    if (!selectedEscrow) return;
    
    try {
      // TODO: Upload files to IPFS
      // const fileHashes = data.files ? await Promise.all(data.files.map(uploadToIpfs)) : [];
      
      await submitWork(selectedEscrow.id, {
        description: data.description,
        // fileHashes,
        submittedAt: Date.now()
      });
      
      setShowSubmitModal(false);
      setSelectedEscrow(null);
    } catch (error) {
      console.error('Error submitting work:', error);
      alert('Erro ao submeter trabalho. Tente novamente.');
    }
  };

  const handleDispute = async (reason: string) => {
    if (!selectedEscrow) return;
    
    try {
      await disputeEscrow(selectedEscrow.id, reason);
      setShowDisputeDialog(false);
      setSelectedEscrow(null);
    } catch (error) {
      console.error('Error creating dispute:', error);
      alert('Erro ao abrir disputa. Tente novamente.');
    }
  };

  const getEscrowActions = (escrow: Escrow) => {
    const actions = [];
    
    if (escrow.state === 'IN_PROGRESS') {
      actions.push({
        key: 'submit',
        label: '📤 Submeter Trabalho',
        color: 'bg-purple-600 hover:bg-purple-700 text-white',
        onClick: () => {
          setSelectedEscrow(escrow);
          setShowSubmitModal(true);
        }
      });
    }
    
    if (['IN_PROGRESS', 'SUBMITTED'].includes(escrow.state)) {
      actions.push({
        key: 'dispute',
        label: '⚖️ Abrir Disputa',
        color: 'bg-orange-600 hover:bg-orange-700 text-white',
        onClick: () => {
          setSelectedEscrow(escrow);
          setShowDisputeDialog(true);
        }
      });
    }
    
    return actions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard do Freelancer
              </h1>
              <p className="text-sm text-gray-600">
                Gerencie suas propostas e projetos em andamento
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
                <p className="text-sm font-medium text-gray-600">Propostas Enviadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProposals}</p>
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
                <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
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
                <p className="text-sm font-medium text-gray-600">Ganhos Totais</p>
                <p className="text-2xl font-semibold text-gray-900">{formatBZR(stats.totalEarnings)}</p>
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
                <p className="text-sm font-medium text-gray-600">Pendente</p>
                <p className="text-2xl font-semibold text-gray-900">{formatBZR(stats.pendingEarnings)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('proposals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'proposals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Minhas Propostas ({stats.totalProposals})
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Projetos Aceitos ({stats.acceptedProposals})
              </button>
              <button
                onClick={() => setActiveTab('escrows')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'escrows'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Escrows ({myEscrows.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Proposals Tab */}
            {activeTab === 'proposals' && (
              <div className="space-y-4">
                {proposalsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando propostas...</p>
                  </div>
                ) : myProposals.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma proposta ainda</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Explore projetos e envie suas primeiras propostas.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/work"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                      >
                        Explorar Projetos
                      </Link>
                    </div>
                  </div>
                ) : (
                  myProposals.map((proposal) => (
                    <div key={proposal.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getProposalStatusColor(proposal.status)}`}>
                              {PROPOSAL_STATUS_LABELS[proposal.status]}
                            </span>
                            <span className="text-sm text-gray-500">
                              {timeAgo(proposal.createdAt)}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Projeto: {proposal.projectId}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {formatBZR(proposal.bidBZR)} BZR
                          </div>
                          <div className="text-sm text-gray-500">Proposta</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {proposal.coverLetter}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {proposal.milestones.length} milestones
                        </span>
                        <Link
                          to={`/work/p/projeto-${proposal.projectId}`} // TODO: Use actual project slug
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                        >
                          Ver Projeto
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                {acceptedProposals.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto aceito</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Quando suas propostas forem aceitas, elas aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  acceptedProposals.map((proposal) => (
                    <div key={proposal.id} className="border border-gray-200 rounded-lg p-6 bg-green-50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-2">
                            ✅ Proposta Aceita
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Projeto: {proposal.projectId}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Aceita {timeAgo(proposal.updatedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {formatBZR(proposal.bidBZR)} BZR
                          </div>
                          <div className="text-sm text-gray-500">Valor do contrato</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link
                          to={`/work/p/projeto-${proposal.projectId}`} // TODO: Use actual project slug
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                        >
                          Ver Projeto Completo
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Escrows Tab */}
            {activeTab === 'escrows' && (
              <div className="space-y-4">
                {escrowsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando escrows...</p>
                  </div>
                ) : myEscrows.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum escrow ativo</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Escrows são criados automaticamente quando suas propostas são aceitas.
                    </p>
                  </div>
                ) : (
                  myEscrows.map((escrow) => (
                    <div key={escrow.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <EscrowStatusBadge state={escrow.state} />
                            <span className="text-sm text-gray-500">
                              Projeto: {escrow.projectId}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Cliente: {escrow.clientAddress.slice(0, 12)}...{escrow.clientAddress.slice(-4)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {formatBZR(escrow.amountTotalBZR)} BZR
                          </div>
                          <div className="text-sm text-gray-500">Total</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-md">
                          <div className="text-lg font-semibold text-blue-600">
                            {formatBZR(escrow.amountFundedBZR)}
                          </div>
                          <div className="text-xs text-gray-500">Financiado</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-md">
                          <div className="text-lg font-semibold text-green-600">
                            {formatBZR(escrow.amountReleasedBZR)}
                          </div>
                          <div className="text-xs text-gray-500">Recebido</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-md">
                          <div className="text-lg font-semibold text-yellow-600">
                            {formatBZR(escrow.amountFundedBZR - escrow.amountReleasedBZR)}
                          </div>
                          <div className="text-xs text-gray-500">Pendente</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getEscrowActions(escrow).map((action) => (
                          <button
                            key={action.key}
                            onClick={action.onClick}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${action.color}`}
                          >
                            {action.label}
                          </button>
                        ))}
                        
                        <Link
                          to={`/work/p/projeto-${escrow.projectId}`} // TODO: Use actual project slug
                          className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200"
                        >
                          Ver Projeto
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubmitWorkModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          setSelectedEscrow(null);
        }}
        onSubmit={handleSubmitWork}
        projectTitle={selectedEscrow ? `Projeto ${selectedEscrow.projectId}` : undefined}
      />

      <DisputeDialog
        isOpen={showDisputeDialog}
        onClose={() => {
          setShowDisputeDialog(false);
          setSelectedEscrow(null);
        }}
        onSubmit={handleDispute}
        projectTitle={selectedEscrow ? `Projeto ${selectedEscrow.projectId}` : undefined}
        userType="freelancer"
      />
    </div>
  );
};