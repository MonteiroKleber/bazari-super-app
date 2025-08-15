// src/features/work/entities/workTypes.ts
export type WorkCategory = 
  | 'desenvolvimento'
  | 'design'
  | 'marketing'
  | 'redacao'
  | 'consultoria'
  | 'traducao'
  | 'dados'
  | 'vendas'
  | 'suporte'
  | 'outros';

export type WorkTag = string;

export type ProjectStatus = 'OPEN' | 'IN_NEGOTIATION' | 'IN_PROGRESS' | 'SUBMITTED' | 'CLOSED';

export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export type EscrowState = 
  | 'CREATED' 
  | 'FUNDED' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'DISPUTED' 
  | 'RELEASED' 
  | 'REFUNDED';

export type EscrowEventType = 
  | 'CREATE'
  | 'FUND'
  | 'SUBMIT'
  | 'DISPUTE'
  | 'RELEASE'
  | 'REFUND'
  | 'MILESTONE_RELEASE';

export interface Milestone {
  id: string;
  title: string;
  amountBZR: number;
  done: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  budgetMinBZR: number;
  budgetMaxBZR: number;
  currency: 'BZR';
  category: WorkCategory;
  tags: WorkTag[];
  ownerAddress: string;
  createdAt: number;
  updatedAt: number;
  status: ProjectStatus;
  escrowId?: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerAddress: string;
  coverLetter: string;
  bidBZR: number;
  milestones: Milestone[];
  status: ProposalStatus;
  createdAt: number;
  updatedAt: number;
}

export interface EscrowEvent {
  ts: number;
  type: EscrowEventType;
  meta?: any;
}

export interface Escrow {
  id: string;
  projectId: string;
  clientAddress: string;
  freelancerAddress: string;
  amountTotalBZR: number;
  amountFundedBZR: number;
  amountReleasedBZR: number;
  state: EscrowState;
  events: EscrowEvent[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkFilters {
  q?: string;
  category?: WorkCategory;
  tags?: WorkTag[];
  sort?: 'newest' | 'budget_asc' | 'budget_desc';
  limit?: number;
  offset?: number;
}

export interface WorkListResponse {
  projects: Project[];
  total: number;
  hasMore: boolean;
}

// Constantes úteis
export const WORK_CATEGORIES: { value: WorkCategory; label: string }[] = [
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
];

export const ESCROW_STATE_LABELS: Record<EscrowState, string> = {
  CREATED: 'Criado',
  FUNDED: 'Financiado',
  IN_PROGRESS: 'Em Progresso',
  SUBMITTED: 'Submetido',
  DISPUTED: 'Em Disputa',
  RELEASED: 'Liberado',
  REFUNDED: 'Reembolsado'
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  OPEN: 'Aberto',
  IN_NEGOTIATION: 'Em Negociação',
  IN_PROGRESS: 'Em Progresso',
  SUBMITTED: 'Submetido',
  CLOSED: 'Fechado'
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceita',
  REJECTED: 'Rejeitada',
  WITHDRAWN: 'Retirada'
};