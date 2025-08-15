// src/features/dao/hooks/useDAO.ts

import { useState, useEffect, useCallback } from 'react'
import { 
  Proposal, 
  Vote, 
  VoteOption, 
  TreasuryBalance, 
  GovernanceStats,
  CreateProposalData,
  UseDAOReturn,
  VotingPower
} from '../types/dao.types'
import { daoService } from '../services/daoService'

/**
 * Hook principal para gerenciar estado e ações da DAO
 */
export const useDAO = (): UseDAOReturn => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [treasury, setTreasury] = useState<TreasuryBalance>({ BZR: 0, ZARI: 0, lastUpdated: 0 })
  const [stats, setStats] = useState<GovernanceStats>({
    totalProposals: 0,
    activeProposals: 0,
    totalVoters: 0,
    totalZariStaked: 0,
    averageParticipation: 0,
    treasury: { BZR: 0, ZARI: 0, lastUpdated: 0 }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Carrega dados iniciais da DAO
   */
  const loadDAOData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [proposalsData, votesData, treasuryData, statsData] = await Promise.all([
        daoService.getProposals(),
        daoService.getVotes(),
        daoService.getTreasuryBalance(),
        daoService.getGovernanceStats()
      ])

      setProposals(proposalsData)
      setVotes(votesData)
      setTreasury(treasuryData)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load DAO data')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Cria nova proposta
   */
  const createProposal = useCallback(async (data: CreateProposalData): Promise<string> => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com wallet para obter endereço do usuário
      const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      
      const proposalId = await daoService.createProposal(data, mockUserAddress)
      
      // Recarregar dados
      await loadDAOData()
      
      return proposalId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create proposal'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDAOData])

  /**
   * Vota em uma proposta
   */
  const castVote = useCallback(async (proposalId: string, option: VoteOption): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com wallet para obter endereço do usuário
      const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      
      await daoService.castVote(proposalId, mockUserAddress, option)
      
      // Recarregar dados
      await loadDAOData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cast vote'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDAOData])

  /**
   * Coloca proposta na fila (queue)
   */
  const queueProposal = useCallback(async (proposalId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Mock - proposta automaticamente vai para queue quando Succeeded
      await loadDAOData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to queue proposal'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDAOData])

  /**
   * Executa proposta
   */
  const executeProposal = useCallback(async (proposalId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      await daoService.executeProposal(proposalId)
      
      // Recarregar dados
      await loadDAOData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute proposal'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDAOData])

  /**
   * Cancela proposta
   */
  const cancelProposal = useCallback(async (proposalId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Implementar lógica de cancelamento
      await loadDAOData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel proposal'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadDAOData])

  /**
   * Busca proposta por ID
   */
  const getProposal = useCallback((id: string): Proposal | undefined => {
    return proposals.find(p => p.id === id)
  }, [proposals])

  /**
   * Busca votos de um usuário
   */
  const getUserVotes = useCallback((address: string): Vote[] => {
    return votes.filter(v => v.voter === address)
  }, [votes])

  /**
   * Busca poder de voto de um usuário
   */
  const getVotingPower = useCallback((address: string): VotingPower | null => {
    const power = daoService.getVotingPower(address)
    if (power === 0) return null

    // Calcular percentual do total
    const totalPower = stats.totalZariStaked
    const percentage = totalPower > 0 ? (power / totalPower) * 100 : 0
    
    // Mock rank (seria calculado baseado em todos os holders)
    const rank = Math.floor(Math.random() * 100) + 1

    return {
      address,
      balance: power,
      percentage,
      rank
    }
  }, [stats.totalZariStaked])

  /**
   * Verifica se usuário pode criar proposta
   */
  const canCreateProposal = useCallback((address: string): boolean => {
    return daoService.canCreateProposal(address)
  }, [])

  /**
   * Verifica se usuário pode votar em uma proposta
   */
  const canVote = useCallback((proposalId: string, address: string): boolean => {
    const proposal = getProposal(proposalId)
    if (!proposal || proposal.state !== 'active') return false

    const userVote = votes.find(v => v.proposalId === proposalId && v.voter === address)
    if (userVote) return false // Já votou

    const votingPower = daoService.getVotingPower(address)
    return votingPower > 0
  }, [getProposal, votes])

  // Caregar dados na inicialização
  useEffect(() => {
    loadDAOData()
  }, [loadDAOData])

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadDAOData()
    }, 30000)

    return () => clearInterval(interval)
  }, [loadDAOData])

  return {
    // State
    proposals,
    votes,
    treasury,
    stats,
    loading,
    error,
    
    // Actions
    createProposal,
    castVote,
    queueProposal,
    executeProposal,
    cancelProposal,
    
    // Queries
    getProposal,
    getUserVotes,
    getVotingPower,
    canCreateProposal,
    canVote
  }
}

/**
 * Hook especializado para buscar dados de uma proposta específica
 */
export const useProposal = (proposalId: string) => {
  const { proposals, votes, loading, error, castVote, executeProposal, queueProposal } = useDAO()
  
  const proposal = proposals.find(p => p.id === proposalId)
  const proposalVotes = votes.filter(v => v.proposalId === proposalId)
  
  return {
    proposal,
    votes: proposalVotes,
    loading,
    error,
    castVote: (option: VoteOption) => castVote(proposalId, option),
    executeProposal: () => executeProposal(proposalId),
    queueProposal: () => queueProposal(proposalId)
  }
}

/**
 * Hook para dados do tesouro da DAO
 */
export const useTreasury = () => {
  const { treasury, stats, loading, error } = useDAO()
  
  const [history, setHistory] = useState<any[]>([])
  
  useEffect(() => {
    // Carregar histórico do tesouro
    const treasuryHistory = daoService.getTreasuryHistory()
    setHistory(treasuryHistory)
  }, [treasury])
  
  return {
    balance: treasury,
    history,
    stats,
    loading,
    error
  }
}