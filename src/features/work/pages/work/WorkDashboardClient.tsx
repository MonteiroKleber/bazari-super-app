// src/features/work/pages/work/WorkDashboardClient.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWork } from '../../hooks/useWork';
import { EscrowStatusBadge } from '../../components/EscrowStatusBadge';
import { PROJECT_STATUS_LABELS } from '../../entities/workTypes';
import type { Project, Escrow } from '../../entities/workTypes';

export const WorkDashboardClient: React.FC = () => {
  const {
    projects,
    escrows,
    projectsLoading,
    escrowsLoading,
    projectsError,
    escrowsError,
    loadEscrowsByUser,
    fundEscrow,
    markEscrowInProgress,
    releaseEscrow,
    refundEscrow
  } = useWork();

  // Mock current user (TODO: Replace with actual auth context)
  const currentUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

  const [activeTab, setActiveTab] = useState<'projects' | 'escrows'>('projects');

  useEffect(() => {
    loadEscrowsByUser(currentUserAddress);
  }, [loadEscrowsByUser, currentUserAddress]);

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

  // Filter projects by current user
  const myProjects = projects.filter(p => p.ownerAddress === currentUserAddress);
  const myEscrows = escrows.filter(e => e.clientAddress === currentUserAddress);

  // Calculate stats
  const stats = {
    totalProjects: myProjects.length,
    openProjects: myProjects.filter(p => p.status === 'OPEN').length,
    inProgressProjects: myProjects.filter(p => p.status === 'IN_PROGRESS').length,
    totalEscrows: myEscrows.length,
    totalValueLocked: myEscrows.reduce((sum, e) => sum + e.amountFundedBZR, 0),
    totalValueReleased: myEscrows.reduce((sum, e) => sum + e.amountReleasedBZR, 0),
    pendingActions: myEscrows.filter(e => 
      ['CREATED', 'FUNDED', 'SUBMITTED'].includes(e.state)
    ).length
  };

  const handleQuickAction = async (escrow: Escrow, action: string) => {
    try {
      switch (action) {
        case 'fund':
          await fundEscrow(escrow.id, escrow.amountTotalBZR);
          break;
        case 'markInProgress':
          await markEscrowInProgress(escrow.id);
          break;
        case 'release':
          if (window.confirm('Liberar o pagamento completo? Esta ação não pode ser desfeita.')) {
            await releaseEscrow(escrow.id);
          }
          break;
        case 'refund':
          if (window.confirm('Reembolsar o escrow? Esta ação não pode ser desfeita.')) {
            await refundEscrow(escrow.id);
          }
          break;
      }
    } catch (error) {
      console.error(`Error executing ${action}:`, error);
      alert(`Erro ao executar ação. Tente novamente.`);
    }
  };

  const getProjectStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'IN_NEGOTIATION':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'SUBMITTED':
        return 'bg-purple-100 text-purple-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuickActions = (escrow: Escrow) => {
    const actions = [];
    
    switch (escrow.state) {
      case 'CREATED':
        actions.push({
          key: 'fund',
          label: '💰 Financiar',
          color: 'bg-blue-600 hover:bg-blue-700 text-white'
        });
        break;
      case 'FUNDED':
        actions.push({
          key: 'markInProgress',
          label: '⚡ Iniciar',
          color: 'bg-green-600 hover:bg-green-700 text-white'
        });
        break;
      case 'SUBMITTED':
        actions.push({
          key: 'release',
          label: '✅ Liberar',
          color: 'bg-green-600 hover:bg-green-700 text-white'
        });
        break;
      case 'DISPUTED':
        actions.push({
          key: 'release',
          label: '✅ Liberar',
          color: 'bg-green-600 hover:bg-green-700 text-white'
        });
        actions.push({
          key: 'refund',
          label: '↩️ Reembolsar',
          color: 'bg-red-600 hover:bg-red-700 text-white'
        });
        break;
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
                Dashboard do Cliente
              </h1>
              <p className="text-sm text-gray-600">
                Gerencie seus projetos e escrows ativos
              </p>
            </div>
            <Link
              to="/work/new"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Projeto
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Meus Projetos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
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
                <p className="text-sm font-medium text-gray-600">Em Progresso</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.inProgressProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Bloqueado</p>
                <p className="text-2xl font-semibold text-gray-900">{formatBZR(stats.totalValueLocked)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ações Pendentes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingActions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meus Projetos ({stats.totalProjects})
              </button>
              <button
                onClick={() => setActiveTab('escrows')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'escrows'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Escrows Ativos ({stats.totalEscrows})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {projectsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando projetos...</p>
                  </div>
                ) : projectsError ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar</h3>
                    <p className="mt-1 text-sm text-gray-500">{projectsError}</p>
                  </div>
                ) : myProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto ainda</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Publique seu primeiro projeto para começar a receber propostas.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/work/new"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                      >
                        Criar Primeiro Projeto
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {myProjects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getProjectStatusColor(project.status)}`}>
                              {PROJECT_STATUS_LABELS[project.status]}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-2">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Orçamento: {formatBZR(project.budgetMinBZR)} - {formatBZR(project.budgetMaxBZR)} BZR</span>
                          <span>{timeAgo(project.createdAt)}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            to={`/work/p/${project.slug}`}
                            className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                          >
                            Ver Detalhes
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Escrows Tab */}
            {activeTab === 'escrows' && (
              <div className="space-y-6">
                {escrowsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando escrows...</p>
                  </div>
                ) : escrowsError ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar</h3>
                    <p className="mt-1 text-sm text-gray-500">{escrowsError}</p>
                  </div>
                ) : myEscrows.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum escrow ativo</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Escrows são criados automaticamente quando você aceita uma proposta.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myEscrows.map((escrow) => (
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
                              Freelancer: {escrow.freelancerAddress.slice(0, 12)}...{escrow.freelancerAddress.slice(-4)}
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
                            <div className="text-xs text-gray-500">Liberado</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-md">
                            <div className="text-lg font-semibold text-yellow-600">
                              {formatBZR(escrow.amountFundedBZR - escrow.amountReleasedBZR)}
                            </div>
                            <div className="text-xs text-gray-500">Restante</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {getQuickActions(escrow).map((action) => (
                            <button
                              key={action.key}
                              onClick={() => handleQuickAction(escrow, action.key)}
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
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};