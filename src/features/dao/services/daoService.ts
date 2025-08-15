// src/features/dao/services/daoService.ts

import { 
  Proposal, 
  Vote, 
  ProposalState, 
  VoteOption, 
  TreasuryEntry, 
  TreasuryBalance, 
  VoteSnapshot,
  CreateProposalData,
  GOVERNANCE_CONSTANTS,
  GovernanceStats
} from '../types/dao.types'

/**
 * Serviço de DAO - gerencia toda a lógica de governança
 * Usa localStorage para persistência (mock)
 */
class DAOService {
  private readonly STORAGE_KEYS = {
    PROPOSALS: 'dao:proposals',
    VOTES: 'dao:votes',
    TREASURY: 'dao:treasury',
    SNAPSHOTS: 'dao:snapshots',
    BALANCES: 'dao:balances' // Mock de saldos ZARI
  } as const

  /**
   * Inicializa dados mockados se não existirem
   */
  private initializeMockData(): void {
    if (!localStorage.getItem(this.STORAGE_KEYS.PROPOSALS)) {
      const mockProposals = this.createMockProposals()
      localStorage.setItem(this.STORAGE_KEYS.PROPOSALS, JSON.stringify(mockProposals))
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.TREASURY)) {
      const initialTreasury: TreasuryBalance = {
        BZR: 50000,
        ZARI: 25000,
        lastUpdated: Date.now()
      }
      localStorage.setItem(this.STORAGE_KEYS.TREASURY, JSON.stringify(initialTreasury))
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.BALANCES)) {
      const mockBalances = this.createMockZariBalances()
      localStorage.setItem(this.STORAGE_KEYS.BALANCES, JSON.stringify(mockBalances))
    }
  }

  /**
   * Cria propostas mock para demonstração
   */
  private createMockProposals(): Proposal[] {
    const now = Date.now()
    
    return [
      {
        id: 'prop-001',
        title: 'Aumentar Recompensas do Pool BZR-ZARI',
        description: 'Proposta para aumentar as recompensas do pool BZR-ZARI de 100 ZARI/dia para 150 ZARI/dia para incentivar mais liquidez.',
        type: 'parameter_change',
        proposer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        state: ProposalState.ACTIVE,
        createdAt: now - 3600000, // 1 hora atrás
        startTime: now - 1800000, // 30 min atrás
        endTime: now + 86400000, // 24 horas
        forVotes: 15420,
        againstVotes: 3200,
        abstainVotes: 800,
        totalVotes: 19420,
        quorumRequired: 10,
        thresholdRequired: 50,
        deposit: 50,
        refunded: false,
        actions: [{
          type: 'parameter_change',
          description: 'Aumentar reward rate do pool BZR-ZARI'
        }]
      },
      {
        id: 'prop-002',
        title: 'Retirada do Tesouro para Marketing',
        description: 'Proposta para alocar 5000 BZR do tesouro para campanhas de marketing e parcerias estratégicas.',
        type: 'treasury_withdrawal',
        proposer: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        state: ProposalState.SUCCEEDED,
        createdAt: now - 172800000, // 2 dias atrás
        startTime: now - 169200000,
        endTime: now - 86400000, // terminou ontem
        queuedAt: now - 86000000,
        forVotes: 45000,
        againstVotes: 12000,
        abstainVotes: 3000,
        totalVotes: 60000,
        quorumRequired: 10,
        thresholdRequired: 50,
        deposit: 50,
        refunded: true,
        actions: [{
          type: 'transfer',
          target: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
          value: 5000,
          description: 'Transfer 5000 BZR for marketing'
        }]
      }
    ]
  }

  /**
   * Cria saldos mock de ZARI para votação
   */
  private createMockZariBalances(): Record<string, number> {
    return {
      '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY': 25000,
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty': 18500,
      '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y': 12300,
      '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy': 8900,
      '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw': 15600,
      '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL': 7200
    }
  }

  /**
   * Busca todas as propostas
   */
  async getProposals(): Promise<Proposal[]> {
    this.initializeMockData()
    const stored = localStorage.getItem(this.STORAGE_KEYS.PROPOSALS)
    const proposals = stored ? JSON.parse(stored) : []
    
    // Atualizar estados das propostas baseado no tempo
    return proposals.map((proposal: Proposal) => this.updateProposalState(proposal))
  }

  /**
   * Busca proposta por ID
   */
  async getProposal(id: string): Promise<Proposal | null> {
    const proposals = await this.getProposals()
    return proposals.find(p => p.id === id) || null
  }

  /**
   * Cria nova proposta
   */
  async createProposal(data: CreateProposalData, proposer: string): Promise<string> {
    // Verificar saldo ZARI do proposer
    const balances = this.getMockBalances()
    const proposerBalance = balances[proposer] || 0
    
    if (proposerBalance < GOVERNANCE_CONSTANTS.MIN_STAKE_ZARI) {
      throw new Error(`Insufficient ZARI balance. Required: ${GOVERNANCE_CONSTANTS.MIN_STAKE_ZARI}, Available: ${proposerBalance}`)
    }

    const now = Date.now()
    const proposalId = `prop-${Date.now()}`
    
    const newProposal: Proposal = {
      id: proposalId,
      title: data.title,
      description: data.description,
      type: data.type,
      proposer,
      state: ProposalState.DRAFT,
      createdAt: now,
      startTime: now + (GOVERNANCE_CONSTANTS.VOTING_DELAY_MINUTES * 60000),
      endTime: now + (GOVERNANCE_CONSTANTS.VOTING_DELAY_MINUTES * 60000) + (GOVERNANCE_CONSTANTS.VOTING_PERIOD_MINUTES * 60000),
      forVotes: 0,
      againstVotes: 0,
      abstainVotes: 0,
      totalVotes: 0,
      quorumRequired: GOVERNANCE_CONSTANTS.QUORUM_PERCENT,
      thresholdRequired: GOVERNANCE_CONSTANTS.THRESHOLD_PERCENT,
      deposit: GOVERNANCE_CONSTANTS.PROPOSAL_DEPOSIT,
      refunded: false,
      actions: data.actions
    }

    const proposals = await this.getProposals()
    proposals.push(newProposal)
    localStorage.setItem(this.STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals))

    return proposalId
  }

  /**
   * Vota em uma proposta
   */
  async castVote(proposalId: string, voter: string, option: VoteOption): Promise<void> {
    const proposal = await this.getProposal(proposalId)
    if (!proposal) {
      throw new Error('Proposal not found')
    }

    if (proposal.state !== ProposalState.ACTIVE) {
      throw new Error('Proposal is not active for voting')
    }

    // Verificar se já votou
    const existingVote = await this.getUserVote(proposalId, voter)
    if (existingVote) {
      throw new Error('User has already voted on this proposal')
    }

    // Criar snapshot se não existir
    let snapshot = await this.getProposalSnapshot(proposalId)
    if (!snapshot) {
      snapshot = await this.createVoteSnapshot(proposalId)
    }

    // Buscar peso do voto (saldo ZARI no snapshot)
    const voteWeight = snapshot.balances[voter] || 0
    if (voteWeight === 0) {
      throw new Error('No voting power (no ZARI balance)')
    }

    // Criar voto
    const vote: Vote = {
      id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      proposalId,
      voter,
      option,
      weight: voteWeight,
      timestamp: Date.now()
    }

    // Salvar voto
    const votes = await this.getVotes()
    votes.push(vote)
    localStorage.setItem(this.STORAGE_KEYS.VOTES, JSON.stringify(votes))

    // Atualizar contadores da proposta
    await this.updateProposalVoteCounts(proposalId)
  }

  /**
   * Busca todos os votos
   */
  async getVotes(): Promise<Vote[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.VOTES)
    return stored ? JSON.parse(stored) : []
  }

  /**
   * Busca voto específico do usuário
   */
  async getUserVote(proposalId: string, voter: string): Promise<Vote | null> {
    const votes = await this.getVotes()
    return votes.find(v => v.proposalId === proposalId && v.voter === voter) || null
  }

  /**
   * Cria snapshot dos saldos para votação
   */
  private async createVoteSnapshot(proposalId: string): Promise<VoteSnapshot> {
    const balances = this.getMockBalances()
    
    const snapshot: VoteSnapshot = {
      proposalId,
      blockNumber: Math.floor(Date.now() / 1000), // Mock block number
      timestamp: Date.now(),
      balances
    }

    const snapshots = this.getSnapshots()
    snapshots.push(snapshot)
    localStorage.setItem(this.STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots))

    return snapshot
  }

  /**
   * Busca snapshot de uma proposta
   */
  async getProposalSnapshot(proposalId: string): Promise<VoteSnapshot | null> {
    const snapshots = this.getSnapshots()
    return snapshots.find(s => s.proposalId === proposalId) || null
  }

  /**
   * Busca snapshots salvos
   */
  private getSnapshots(): VoteSnapshot[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.SNAPSHOTS)
    return stored ? JSON.parse(stored) : []
  }

  /**
   * Busca saldos mock de ZARI
   */
  private getMockBalances(): Record<string, number> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.BALANCES)
    return stored ? JSON.parse(stored) : {}
  }

  /**
   * Atualiza contadores de votos de uma proposta
   */
  private async updateProposalVoteCounts(proposalId: string): Promise<void> {
    const votes = await this.getVotes()
    const proposalVotes = votes.filter(v => v.proposalId === proposalId)
    
    const forVotes = proposalVotes.filter(v => v.option === VoteOption.FOR).reduce((sum, v) => sum + v.weight, 0)
    const againstVotes = proposalVotes.filter(v => v.option === VoteOption.AGAINST).reduce((sum, v) => sum + v.weight, 0)
    const abstainVotes = proposalVotes.filter(v => v.option === VoteOption.ABSTAIN).reduce((sum, v) => sum + v.weight, 0)

    const proposals = await this.getProposals()
    const proposalIndex = proposals.findIndex(p => p.id === proposalId)
    
    if (proposalIndex !== -1) {
      proposals[proposalIndex].forVotes = forVotes
      proposals[proposalIndex].againstVotes = againstVotes
      proposals[proposalIndex].abstainVotes = abstainVotes
      proposals[proposalIndex].totalVotes = forVotes + againstVotes + abstainVotes
      
      localStorage.setItem(this.STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals))
    }
  }

  /**
   * Atualiza estado da proposta baseado no tempo
   */
  private updateProposalState(proposal: Proposal): Proposal {
    const now = Date.now()
    
    switch (proposal.state) {
      case ProposalState.DRAFT:
        if (now >= proposal.startTime) {
          proposal.state = ProposalState.ACTIVE
          // Criar snapshot quando proposta fica ativa
          this.createVoteSnapshot(proposal.id)
        }
        break
        
      case ProposalState.ACTIVE:
        if (now >= proposal.endTime) {
          // Verificar se passou no quórum e threshold
          const totalZari = Object.values(this.getMockBalances()).reduce((sum, balance) => sum + balance, 0)
          const quorumReached = (proposal.totalVotes / totalZari) * 100 >= proposal.quorumRequired
          const thresholdReached = proposal.forVotes > proposal.againstVotes && 
                                 (proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100 > proposal.thresholdRequired
          
          proposal.state = (quorumReached && thresholdReached) ? ProposalState.SUCCEEDED : ProposalState.DEFEATED
        }
        break
        
      case ProposalState.SUCCEEDED:
        if (!proposal.queuedAt) {
          proposal.queuedAt = now
          proposal.state = ProposalState.QUEUED
        }
        break
        
      case ProposalState.QUEUED:
        if (proposal.queuedAt && now >= proposal.queuedAt + (GOVERNANCE_CONSTANTS.TIMELOCK_MINUTES * 60000)) {
          // Auto-executar após timelock
          this.executeProposal(proposal.id)
        }
        break
    }
    
    return proposal
  }

  /**
   * Executa uma proposta
   */
  async executeProposal(proposalId: string): Promise<void> {
    const proposal = await this.getProposal(proposalId)
    if (!proposal) {
      throw new Error('Proposal not found')
    }

    if (proposal.state !== ProposalState.QUEUED) {
      throw new Error('Proposal is not ready for execution')
    }

    // Mock de execução - apenas simular efeitos no tesouro
    for (const action of proposal.actions) {
      if (action.type === 'transfer' && action.value) {
        await this.updateTreasury(-action.value, 'BZR', `Execution of proposal ${proposalId}`, proposalId)
      }
    }

    // Atualizar estado da proposta
    const proposals = await this.getProposals()
    const proposalIndex = proposals.findIndex(p => p.id === proposalId)
    
    if (proposalIndex !== -1) {
      proposals[proposalIndex].state = ProposalState.EXECUTED
      proposals[proposalIndex].executedAt = Date.now()
      proposals[proposalIndex].refunded = true // Reembolsar depósito
      
      localStorage.setItem(this.STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals))
    }
  }

  /**
   * Busca saldo do tesouro
   */
  async getTreasuryBalance(): Promise<TreasuryBalance> {
    this.initializeMockData()
    const stored = localStorage.getItem(this.STORAGE_KEYS.TREASURY)
    return stored ? JSON.parse(stored) : { BZR: 0, ZARI: 0, lastUpdated: Date.now() }
  }

  /**
   * Atualiza saldo do tesouro
   */
  private async updateTreasury(
    amount: number, 
    token: 'BZR' | 'ZARI', 
    description: string, 
    proposalId?: string
  ): Promise<void> {
    const treasury = await this.getTreasuryBalance()
    treasury[token] += amount
    treasury.lastUpdated = Date.now()
    
    localStorage.setItem(this.STORAGE_KEYS.TREASURY, JSON.stringify(treasury))
    
    // Registrar entrada no histórico
    const entry: TreasuryEntry = {
      id: `treasury-${Date.now()}`,
      type: amount > 0 ? 'inflow' : 'outflow',
      amount: Math.abs(amount),
      token,
      description,
      proposalId,
      timestamp: Date.now()
    }
    
    const history = this.getTreasuryHistory()
    history.push(entry)
    localStorage.setItem('dao:treasury_history', JSON.stringify(history))
  }

  /**
   * Busca histórico do tesouro
   */
  getTreasuryHistory(): TreasuryEntry[] {
    const stored = localStorage.getItem('dao:treasury_history')
    return stored ? JSON.parse(stored) : []
  }

  /**
   * Busca estatísticas gerais da DAO
   */
  async getGovernanceStats(): Promise<GovernanceStats> {
    const proposals = await this.getProposals()
    const votes = await this.getVotes()
    const treasury = await this.getTreasuryBalance()
    const balances = this.getMockBalances()
    
    const activeProposals = proposals.filter(p => p.state === ProposalState.ACTIVE).length
    const uniqueVoters = new Set(votes.map(v => v.voter)).size
    const totalZariStaked = Object.values(balances).reduce((sum, balance) => sum + balance, 0)
    
    // Calcular participação média
    const totalVotingWeight = votes.reduce((sum, vote) => sum + vote.weight, 0)
    const averageParticipation = proposals.length > 0 ? (totalVotingWeight / (proposals.length * totalZariStaked)) * 100 : 0
    
    return {
      totalProposals: proposals.length,
      activeProposals,
      totalVoters: uniqueVoters,
      totalZariStaked,
      averageParticipation: Math.round(averageParticipation * 100) / 100,
      treasury
    }
  }

  /**
   * Verifica se usuário pode criar proposta
   */
  canCreateProposal(userAddress: string): boolean {
    const balances = this.getMockBalances()
    const userBalance = balances[userAddress] || 0
    return userBalance >= GOVERNANCE_CONSTANTS.MIN_STAKE_ZARI
  }

  /**
   * Busca poder de voto de um usuário
   */
  getVotingPower(userAddress: string): number {
    const balances = this.getMockBalances()
    return balances[userAddress] || 0
  }
}

export const daoService = new DAOService()