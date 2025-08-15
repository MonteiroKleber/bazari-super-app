// src/features/work/hooks/useWork.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { workService } from '../services/workService';
import { escrowService } from '../services/escrowService';
import type { 
  Project, 
  Proposal, 
  Escrow, 
  WorkFilters, 
  WorkCategory,
  WorkTag 
} from '../entities/workTypes';

interface UseWorkState {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  projectsLoading: boolean;
  projectsError: string | null;
  hasMoreProjects: boolean;
  totalProjects: number;

  // Proposals
  proposals: Proposal[];
  proposalsLoading: boolean;
  proposalsError: string | null;

  // Escrows
  escrows: Escrow[];
  currentEscrow: Escrow | null;
  escrowsLoading: boolean;
  escrowsError: string | null;

  // Filters
  filters: WorkFilters;
  availableCategories: Array<{ value: WorkCategory; label: string }>;
  availableTags: WorkTag[];
}

interface UseWorkActions {
  // Project actions
  loadProjects: (reset?: boolean) => Promise<void>;
  loadMoreProjects: () => Promise<void>;
  loadProject: (slug: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProjectStatus: (id: string, status: Project['status']) => Promise<void>;

  // Proposal actions
  loadProposalsByProject: (projectId: string) => Promise<void>;
  loadProposalsByFreelancer: (freelancerAddress: string) => Promise<void>;
  createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Proposal>;
  acceptProposal: (proposalId: string) => Promise<void>;
  rejectProposal: (proposalId: string) => Promise<void>;
  withdrawProposal: (proposalId: string) => Promise<void>;

  // Escrow actions
  loadEscrow: (escrowId: string) => Promise<void>;
  loadEscrowByProject: (projectId: string) => Promise<void>;
  loadEscrowsByUser: (address: string) => Promise<void>;
  createEscrow: (projectId: string, clientAddress: string, freelancerAddress: string, amount: number) => Promise<Escrow>;
  fundEscrow: (escrowId: string, amount: number) => Promise<void>;
  markEscrowInProgress: (escrowId: string) => Promise<void>;
  submitWork: (escrowId: string, submissionData?: any) => Promise<void>;
  disputeEscrow: (escrowId: string, reason: string) => Promise<void>;
  releaseEscrow: (escrowId: string) => Promise<void>;
  refundEscrow: (escrowId: string) => Promise<void>;
  releaseMilestone: (escrowId: string, milestoneId: string, amount: number) => Promise<void>;

  // Filter actions
  updateFilters: (newFilters: Partial<WorkFilters>) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: WorkCategory | undefined) => void;
  addTag: (tag: WorkTag) => void;
  removeTag: (tag: WorkTag) => void;
  setSorting: (sort: WorkFilters['sort']) => void;
}

const INITIAL_FILTERS: WorkFilters = {
  q: '',
  category: undefined,
  tags: [],
  sort: 'newest',
  limit: 12,
  offset: 0
};

export function useWork(): UseWorkState & UseWorkActions {
  // ========================================
  // STATE
  // ========================================
  
  const [state, setState] = useState<UseWorkState>({
    // Projects
    projects: [],
    currentProject: null,
    projectsLoading: false,
    projectsError: null,
    hasMoreProjects: false,
    totalProjects: 0,

    // Proposals
    proposals: [],
    proposalsLoading: false,
    proposalsError: null,

    // Escrows
    escrows: [],
    currentEscrow: null,
    escrowsLoading: false,
    escrowsError: null,

    // Filters
    filters: INITIAL_FILTERS,
    availableCategories: [
      { value: 'desenvolvimento', label: 'Desenvolvimento' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'redacao', label: 'Redação' },
      { value: 'consultoria', label: 'Consultoria' },
      { value: 'traducao', label: 'Tradução' },
      { value: 'dados', label: 'Análise de Dados' },
      { value: 'vendas', label: 'Vendas' },
      { value: 'suporte', label: 'Suporte' },
      { value: 'outros', label: 'Outros' }
    ],
    availableTags: []
  });

  // ========================================
  // COMPUTED VALUES
  // ========================================

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    state.projects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [state.projects]);

  // ========================================
  // PROJECT ACTIONS
  // ========================================

  const loadProjects = useCallback(async (reset = false) => {
    try {
      setState(prev => ({ 
        ...prev, 
        projectsLoading: true, 
        projectsError: null,
        ...(reset && { projects: [], filters: { ...prev.filters, offset: 0 } })
      }));

      const filters = reset ? { ...state.filters, offset: 0 } : state.filters;
      const response = await workService.listProjects(filters);

      setState(prev => ({
        ...prev,
        projects: reset ? response.projects : [...prev.projects, ...response.projects],
        hasMoreProjects: response.hasMore,
        totalProjects: response.total,
        projectsLoading: false,
        availableTags
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        projectsLoading: false, 
        projectsError: error instanceof Error ? error.message : 'Erro ao carregar projetos' 
      }));
    }
  }, [state.filters, availableTags]);

  const loadMoreProjects = useCallback(async () => {
    if (state.projectsLoading || !state.hasMoreProjects) return;

    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        offset: prev.projects.length
      }
    }));

    await loadProjects(false);
  }, [state.projectsLoading, state.hasMoreProjects, state.projects.length, loadProjects]);

  const loadProject = useCallback(async (slug: string) => {
    try {
      setState(prev => ({ ...prev, projectsLoading: true, projectsError: null }));
      
      const project = await workService.getProjectBySlug(slug);
      
      setState(prev => ({
        ...prev,
        currentProject: project,
        projectsLoading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        projectsLoading: false, 
        projectsError: error instanceof Error ? error.message : 'Erro ao carregar projeto' 
      }));
    }
  }, []);

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const project = await workService.createProject(projectData);
      
      setState(prev => ({
        ...prev,
        projects: [project, ...prev.projects]
      }));

      return project;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao criar projeto');
    }
  }, []);

  const updateProjectStatus = useCallback(async (id: string, status: Project['status']) => {
    try {
      const updatedProject = await workService.updateProjectStatus(id, status);
      
      if (updatedProject) {
        setState(prev => ({
          ...prev,
          projects: prev.projects.map(p => p.id === id ? updatedProject : p),
          currentProject: prev.currentProject?.id === id ? updatedProject : prev.currentProject
        }));
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao atualizar projeto');
    }
  }, []);

  // ========================================
  // PROPOSAL ACTIONS
  // ========================================

  const loadProposalsByProject = useCallback(async (projectId: string) => {
    try {
      setState(prev => ({ ...prev, proposalsLoading: true, proposalsError: null }));
      
      const proposals = await workService.listProposalsByProject(projectId);
      
      setState(prev => ({
        ...prev,
        proposals,
        proposalsLoading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        proposalsLoading: false, 
        proposalsError: error instanceof Error ? error.message : 'Erro ao carregar propostas' 
      }));
    }
  }, []);

  const loadProposalsByFreelancer = useCallback(async (freelancerAddress: string) => {
    try {
      setState(prev => ({ ...prev, proposalsLoading: true, proposalsError: null }));
      
      const proposals = await workService.listProposalsByFreelancer(freelancerAddress);
      
      setState(prev => ({
        ...prev,
        proposals,
        proposalsLoading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        proposalsLoading: false, 
        proposalsError: error instanceof Error ? error.message : 'Erro ao carregar propostas' 
      }));
    }
  }, []);

  const createProposal = useCallback(async (proposalData: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const proposal = await workService.createProposal(proposalData);
      
      setState(prev => ({
        ...prev,
        proposals: [proposal, ...prev.proposals]
      }));

      return proposal;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao criar proposta');
    }
  }, []);

  const acceptProposal = useCallback(async (proposalId: string) => {
    await workService.updateProposalStatus(proposalId, 'ACCEPTED');
    await loadProposalsByProject(state.currentProject?.id || '');
  }, [state.currentProject?.id, loadProposalsByProject]);

  const rejectProposal = useCallback(async (proposalId: string) => {
    await workService.updateProposalStatus(proposalId, 'REJECTED');
    await loadProposalsByProject(state.currentProject?.id || '');
  }, [state.currentProject?.id, loadProposalsByProject]);

  const withdrawProposal = useCallback(async (proposalId: string) => {
    await workService.updateProposalStatus(proposalId, 'WITHDRAWN');
    // Recarregar propostas do freelancer atual
    // TODO: Implementar context de usuário atual
  }, []);

  // ========================================
  // ESCROW ACTIONS
  // ========================================

  const loadEscrow = useCallback(async (escrowId: string) => {
    try {
      setState(prev => ({ ...prev, escrowsLoading: true, escrowsError: null }));
      
      const escrow = await escrowService.getById(escrowId);
      
      setState(prev => ({
        ...prev,
        currentEscrow: escrow,
        escrowsLoading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        escrowsLoading: false, 
        escrowsError: error instanceof Error ? error.message : 'Erro ao carregar escrow' 
      }));
    }
  }, []);

  const loadEscrowByProject = useCallback(async (projectId: string) => {
    try {
      const escrow = await escrowService.getByProjectId(projectId);
      setState(prev => ({ ...prev, currentEscrow: escrow }));
    } catch (error) {
      console.error('Erro ao carregar escrow:', error);
    }
  }, []);

  const loadEscrowsByUser = useCallback(async (address: string) => {
    try {
      setState(prev => ({ ...prev, escrowsLoading: true, escrowsError: null }));
      
      const escrows = await escrowService.listByAddress(address);
      
      setState(prev => ({
        ...prev,
        escrows,
        escrowsLoading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        escrowsLoading: false, 
        escrowsError: error instanceof Error ? error.message : 'Erro ao carregar escrows' 
      }));
    }
  }, []);

  const createEscrow = useCallback(async (projectId: string, clientAddress: string, freelancerAddress: string, amount: number) => {
    try {
      const escrow = await escrowService.createEscrow(projectId, clientAddress, freelancerAddress, amount);
      
      setState(prev => ({
        ...prev,
        currentEscrow: escrow,
        escrows: [escrow, ...prev.escrows]
      }));

      return escrow;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao criar escrow');
    }
  }, []);

  // Ações do escrow
  const fundEscrow = useCallback(async (escrowId: string, amount: number) => {
    const escrow = await escrowService.fund(escrowId, amount);
    if (escrow) {
      setState(prev => ({ ...prev, currentEscrow: escrow }));
    }
  }, []);

  const markEscrowInProgress = useCallback(async (escrowId: string) => {
    const escrow = await escrowService.markInProgress(escrowId);
    if (escrow) {
      setState(prev => ({ ...prev, currentEscrow: escrow }));
    }
  }, []);

  const submitWork = useCallback(async (escrowId: string, submissionData?: any) => {
    const escrow = await escrowService.submitWork(escrowId, submissionData);
    if (escrow) {
      setState(prev => ({ ...prev, currentEscrow: escrow }));
    }
  }, []);

  const disputeEscrow = useCallback(async (escrowId: string, reason: string) => {
    const escrow = await escrowService.dispute(escrowId, reason);
    if (escrow) {
      setState(prev => ({ ...prev, currentEscrow: escrow }));
    }
  }, []);

  const releaseEscrow = useCallback(async (escrowId: string) => {
    const escrow = await escrowService.release(escrowId);
    if (escrow) {
      setState(prev => ({ ...prev, currentEscrow: escrow }));
    }
  }, []);

  const refundEscrow = useCallback(async (escrowId: string) => {
    const escrow = await escrowService.refund(escrowId);
    if (escrow) {
      setState(prev => ({ ...prev, currentEscrow: escrow }));
    }
  }, []);

  const releaseMilestone = useCallback(async (escrowId: string, milestoneId: string, amount: number) => {
    const escrow = await escrowService.releaseMilestone(escrowId, milestoneId, amount);
    if (escrow) {
      setState(prev => ({ ...prev, currentEscrow: escrow }));
    }
  }, []);

  // ========================================
  // FILTER ACTIONS
  // ========================================

  const updateFilters = useCallback((newFilters: Partial<WorkFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters, offset: 0 }
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: INITIAL_FILTERS }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    updateFilters({ q: query });
  }, [updateFilters]);

  const setCategory = useCallback((category: WorkCategory | undefined) => {
    updateFilters({ category });
  }, [updateFilters]);

  const addTag = useCallback((tag: WorkTag) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        tags: prev.filters.tags?.includes(tag) 
          ? prev.filters.tags 
          : [...(prev.filters.tags || []), tag],
        offset: 0
      }
    }));
  }, []);

  const removeTag = useCallback((tag: WorkTag) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        tags: prev.filters.tags?.filter(t => t !== tag) || [],
        offset: 0
      }
    }));
  }, []);

  const setSorting = useCallback((sort: WorkFilters['sort']) => {
    updateFilters({ sort });
  }, [updateFilters]);

  // ========================================
  // EFFECTS
  // ========================================

  // Inicializar dados
  useEffect(() => {
    workService.seedIfEmpty();
    escrowService.seedIfEmpty();
    loadProjects(true);
  }, []);

  // Recarregar quando filtros mudarem
  useEffect(() => {
    if (state.filters !== INITIAL_FILTERS) {
      loadProjects(true);
    }
  }, [state.filters.q, state.filters.category, state.filters.tags, state.filters.sort]);


// dentro do hook useWork (antes do return), usando seus estados atuais:
const getProjectBySlug = (slug: string) => {
  if (!slug) return null;
  const list = Array.isArray(projects) ? projects : [];
  return (
    list.find((p: any) => p?.slug === slug) ??
    list.find((p: any) => String(p?.id) === String(slug)) ??
    null
  );
};

const getProposalsByProject = (projectId: string | number) => {
  const list = Array.isArray(proposals) ? proposals : [];
  return list.filter((pr: any) => String(pr?.projectId) === String(projectId));
};

const getEscrowByProject = (projectId: string | number) => {
  const list = Array.isArray(escrows) ? escrows : [];
  return list.find((e: any) => String(e?.projectId) === String(projectId)) ?? null;
};



  // ========================================
  // RETURN
  // ========================================

  return {
    // State
    ...state,
    availableTags,

    // Actions
    loadProjects,
    loadMoreProjects,
    loadProject,
    createProject,
    updateProjectStatus,

    loadProposalsByProject,
    loadProposalsByFreelancer,
    createProposal,
    acceptProposal,
    rejectProposal,
    withdrawProposal,

    loadEscrow,
    loadEscrowByProject,
    loadEscrowsByUser,
    createEscrow,
    fundEscrow,
    markEscrowInProgress,
    submitWork,
    disputeEscrow,
    releaseEscrow,
    refundEscrow,
    releaseMilestone,

    updateFilters,
    resetFilters,
    setSearchQuery,
    setCategory,
    addTag,
    removeTag,
    setSorting,

    getProjectBySlug,
    getProposalsByProject,
    getEscrowByProject

  };
}