// src/features/dao/types/dao.types.ts

export enum ProposalState {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUCCEEDED = 'succeeded',
  DEFEATED = 'defeated',
  QUEUED = 'queued',
  EXECUTED = 'executed',
  CANCELLED = 'cancelled'
}

export enum VoteOption {
  FOR = 'for',
  AGAINST = 'against',
  ABSTAIN = 'abstain'
}

export enum ProposalType {
  TREASURY_WITHDRAWAL = 'treasury_withdrawal',
  PARAMETER_CHANGE = 'parameter_change',
  PROTOCOL_UPGRADE = 'protocol_upgrade',
  GENERAL_PROPOSAL = 'general_proposal'
}

export interface Vote {
  id: string
  proposalId: string
  voter: string
  option: VoteOption
  weight: number // ZARI balance at snapshot
  timestamp: number
  txHash?: string
}

export interface VoteSnapshot {
  proposalId: string
  blockNumber: number
  timestamp: number
  balances: Record<string, number> // address -> ZARI balance
}

export interface Proposal {
  id: string
  title: string
  description: string
  type: ProposalType
  proposer: string
  state: ProposalState
  
  // Timestamps (em milissegundos)
  createdAt: number
  startTime: number
  endTime: number
  queuedAt?: number
  executedAt?: number
  
  // Voting
  snapshot?: VoteSnapshot
  forVotes: number
  againstVotes: number
  abstainVotes: number
  totalVotes: number
  
  // Requirements
  quorumRequired: number // percentual
  thresholdRequired: number // percentual
  
  // Financial
  deposit: number // ZARI staked
  refunded: boolean
  
  // Actions (simplified for mock)
  actions: ProposalAction[]
}

export interface ProposalAction {
  type: 'transfer' | 'parameter_change' | 'contract_call'
  target?: string
  value?: number
  data?: any
  description: string
}

export interface TreasuryEntry {
  id: string
  type: 'inflow' | 'outflow'
  amount: number
  token: 'BZR' | 'ZARI'
  description: string
  proposalId?: string
  timestamp: number
  txHash?: string
}

export interface TreasuryBalance {
  BZR: number
  ZARI: number
  lastUpdated: number
}

export interface GovernanceStats {
  totalProposals: number
  activeProposals: number
  totalVoters: number
  totalZariStaked: number
  averageParticipation: number
  treasury: TreasuryBalance
}

export interface VotingPower {
  address: string
  balance: number
  percentage: number
  rank: number
}

// Constantes de governança
export const GOVERNANCE_CONSTANTS = {
  MIN_STAKE_ZARI: 100, // Mínimo para criar proposta
  VOTING_DELAY_MINUTES: 60, // Tempo entre criação e início da votação
  VOTING_PERIOD_MINUTES: 10080, // 7 dias em minutos
  TIMELOCK_MINUTES: 4320, // 3 dias em minutos
  QUORUM_PERCENT: 10, // 10% dos tokens em circulação
  THRESHOLD_PERCENT: 50, // >50% dos votos válidos
  PROPOSAL_DEPOSIT: 50, // ZARI reembolsável
  MAX_ACTIONS_PER_PROPOSAL: 10
} as const

// Interface para hooks
export interface UseDAOReturn {
  // State
  proposals: Proposal[]
  votes: Vote[]
  treasury: TreasuryBalance
  stats: GovernanceStats
  loading: boolean
  error: string | null
  
  // Actions
  createProposal: (data: CreateProposalData) => Promise<string>
  castVote: (proposalId: string, option: VoteOption) => Promise<void>
  queueProposal: (proposalId: string) => Promise<void>
  executeProposal: (proposalId: string) => Promise<void>
  cancelProposal: (proposalId: string) => Promise<void>
  
  // Queries
  getProposal: (id: string) => Proposal | undefined
  getUserVotes: (address: string) => Vote[]
  getVotingPower: (address: string) => VotingPower | null
  canCreateProposal: (address: string) => boolean
  canVote: (proposalId: string, address: string) => boolean
}

export interface CreateProposalData {
  title: string
  description: string
  type: ProposalType
  actions: ProposalAction[]
}

export interface VoteBreakdown {
  for: {
    votes: number
    percentage: number
    weight: number
  }
  against: {
    votes: number
    percentage: number
    weight: number
  }
  abstain: {
    votes: number
    percentage: number
    weight: number
  }
  quorum: {
    current: number
    required: number
    achieved: boolean
  }
  threshold: {
    current: number
    required: number
    achieved: boolean
  }
}