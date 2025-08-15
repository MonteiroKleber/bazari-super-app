// src/features/work/pages/work/WorkProjectDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWork } from '../../hooks/useWork';
import { ProposalCard } from '../../components/ProposalCard';
import { EscrowStatusBadge } from '../../components/EscrowStatusBadge';
import { MilestoneList } from '../../components/MilestoneList';
import { SubmitWorkModal } from '../../components/SubmitWorkModal';
import { DisputeDialog } from '../../components/DisputeDialog';
import { PROJECT_STATUS_LABELS } from '../../entities/workTypes';

export const WorkProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const {
    currentProject: project,
    currentEscrow: escrow,
    proposals,
    projectsLoading,
    projectsError,
    proposalsLoading,
    loadProject,
    loadProposalsByProject,
    loadEscrowByProject,
    acceptProposal,
    rejectProposal,
    createProposal,
    createEscrow,
    fundEscrow,
    markEscrowInProgress,
    submitWork,
    disputeEscrow,
    releaseEscrow,
    refundEscrow,
    releaseMilestone
  } = useWork();

  // Mock current user (TODO: Replace with actual auth context)
  const currentUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const isOwner = project?.ownerAddress === currentUserAddress;

  useEffect(() => {
    if (slug) {
      loadProject(slug);
    }
  }, [slug, loadProject]);

  useEffect(() => {
    if (project) {
      loadProposalsByProject(project.id);
      loadEscrowByProject(project.id);
    }
  }, [project, loadProposalsByProject, loadEscrowByProject]);

  const formatBZR = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBudgetRange = () => {
    if (!project) return '';
    if (project.budgetMinBZR === project.budgetMaxBZR) {
      return `${formatBZR(project.budgetMinBZR)} BZR`;
    }
    return `${formatBZR(project.budgetMinBZR)} - ${formatBZR(project.budgetMaxBZR)} BZR`;
  };

  const handleAcceptProposal = async (proposalId: string) => {
    if (!project || !window.confirm('Aceitar esta proposta? Isso criará um escrow automaticamente.')) return;
    
    try {
      await acceptProposal(proposalId);
      
      // Find the accepted proposal to create escrow
      const acceptedProposal = proposals.find(p => p.id === proposalId);
      if (acceptedProposal) {
        await createEscrow(
          project.id,
          project.ownerAddress,
          acceptedProposal.freelancerAddress,
          acceptedProposal.bidBZR
        );
        
        // Update project status
        // await updateProjectStatus(project.id, 'IN_NEGOTIATION');
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
      alert('Erro ao aceitar proposta. Tente novamente.');
    }
  };

  const handleSubmitWork = async (data: { description: string; files?: File[] }) => {
    if (!escrow) return;
    
    // TODO: Upload files to IPFS
    // const fileHashes = data.files ? await Promise.all(data.files.map(uploadToIpfs)) : [];
    
    await submitWork(escrow.id, {
      description: data.description,
      // fileHashes,
      submittedAt: Date.now()
    });
  };

  const handleDispute = async (reason: string) => {
    if (!escrow) return;
    await disputeEscrow(escrow.id, reason);
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (projectsError || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Projeto não encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {projectsError || 'O projeto solicitado não existe ou foi removido.'}
          </p>
          <div className="mt-6">
            <Link
              to="/work"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              ← Voltar aos projetos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const timeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d atrás`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h atrás`;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 0) return `${minutes}min atrás`;
    return 'Agora mesmo';
  };

  const canSubmitWork = escrow?.state === 'IN_PROGRESS' && !isOwner;
  const canRelease = escrow?.state === 'SUBMITTED' && isOwner;
  const canDispute = escrow && ['IN_PROGRESS', 'SUBMITTED'].includes(escrow.state);
  const canFund = escrow?.state === 'CREATED' && isOwner;
  const canMarkInProgress = escrow?.state === 'FUNDED' && isOwner;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/work"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 truncate max-w-md">
                  {project.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Publicado {timeAgo(project.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {PROJECT_STATUS_LABELS[project.status]}
              </span>
              {escrow && (
                <EscrowStatusBadge state={escrow.state} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {project.ownerAddress.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {project.ownerAddress.slice(0, 12)}...{project.ownerAddress.slice(-4)}
                      </div>
                      <div className="text-sm text-gray-500">Cliente</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-md">
                      {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {getBudgetRange()}
                  </div>
                  <div className="text-sm text-gray-500">Orçamento</div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição do Projeto</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
              </div>

              {project.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Escrow Actions */}
            {escrow && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Escrow</h2>
                  <EscrowStatusBadge state={escrow.state} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatBZR(escrow.amountTotalBZR)}
                    </div>
                    <div className="text-sm text-gray-500">Total BZR</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatBZR(escrow.amountFundedBZR)}
                    </div>
                    <div className="text-sm text-gray-500">Financiado BZR</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatBZR(escrow.amountReleasedBZR)}
                    </div>
                    <div className="text-sm text-gray-500">Liberado BZR</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {canFund && (
                    <button
                      onClick={() => fundEscrow(escrow.id, escrow.amountTotalBZR)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      💰 Financiar Escrow
                    </button>
                  )}
                  
                  {canMarkInProgress && (
                    <button
                      onClick={() => markEscrowInProgress(escrow.id)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    >
                      ⚡ Marcar como Em Progresso
                    </button>
                  )}
                  
                  {canSubmitWork && (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
                    >
                      📤 Submeter Trabalho
                    </button>
                  )}
                  
                  {canRelease && (
                    <button
                      onClick={() => releaseEscrow(escrow.id)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    >
                      ✅ Liberar Pagamento
                    </button>
                  )}
                  
                  {canDispute && (
                    <button
                      onClick={() => setShowDisputeDialog(true)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100"
                    >
                      ⚖️ Abrir Disputa
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Proposals */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Propostas ({proposals.length})
                </h2>
                {!isOwner && project.status === 'OPEN' && (
                  <button
                    onClick={() => setShowProposalForm(!showProposalForm)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    💼 Fazer Proposta
                  </button>
                )}
              </div>

              {proposalsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando propostas...</p>
                </div>
              ) : proposals.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma proposta ainda</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isOwner ? 'Aguardando freelancers interessados.' : 'Seja o primeiro a fazer uma proposta!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      isOwner={isOwner}
                      onAccept={handleAcceptProposal}
                      onReject={rejectProposal}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Link
                  to="/work"
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                >
                  ← Voltar aos projetos
                </Link>
                
                {isOwner && (
                  <Link
                    to="/work/me/client"
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                  >
                    📊 Meus Projetos
                  </Link>
                )}
                
                {!isOwner && (
                  <Link
                    to="/work/me/freelancer"
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100"
                  >
                    💼 Minhas Propostas
                  </Link>
                )}
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Propostas recebidas:</span>
                  <span className="text-sm font-medium text-gray-900">{proposals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Orçamento médio:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {proposals.length > 0 
                      ? `${formatBZR(proposals.reduce((sum, p) => sum + p.bidBZR, 0) / proposals.length)} BZR`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status do projeto:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {PROJECT_STATUS_LABELS[project.status]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubmitWorkModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitWork}
        projectTitle={project.title}
      />

      <DisputeDialog
        isOpen={showDisputeDialog}
        onClose={() => setShowDisputeDialog(false)}
        onSubmit={handleDispute}
        projectTitle={project.title}
        userType={isOwner ? 'client' : 'freelancer'}
      />
    </div>
  );
};