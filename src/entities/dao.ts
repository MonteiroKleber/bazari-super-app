export interface Proposal {
  id: string
  title: string
  description: string
  type: ProposalType
  
  authorId: string
  authorAddress: string
  
  votingStartsAt: Date
  votingEndsAt: Date
  quorum: number
  
  votes: ProposalVote[]
  totalVotes: number
  totalVotingPower: number
  result?: ProposalResult
  
  status: ProposalStatus
  
  executionData?: any
  executedAt?: Date
  executionTxHash?: string
  
  createdAt: Date
  updatedAt: Date
}

export type ProposalType = 
  | 'governance'
  | 'treasury'
  | 'protocol_upgrade'
  | 'parameter_change'
  | 'community'

export type ProposalStatus = 
  | 'draft'
  | 'active'
  | 'succeeded'
  | 'defeated'
  | 'queued'
  | 'executed'
  | 'cancelled'
  | 'expired'

export interface ProposalVote {
  id: string
  proposalId: string
  voterId: string
  voterAddress: string
  choice: VoteChoice
  votingPower: number
  reason?: string
  timestamp: Date
  txHash: string
}

export type VoteChoice = 'for' | 'against' | 'abstain'

export interface ProposalResult {
  forVotes: number
  againstVotes: number
  abstainVotes: number
  totalVotingPower: number
  quorumReached: boolean
  passed: boolean
}
