// src/features/dao/components/VoteBreakdown.tsx

import { FC } from 'react'
import { Proposal, Vote } from '../types/dao.types'

interface VoteBreakdownProps {
  proposal: Proposal
  votes: Vote[]
}

export const VoteBreakdown: FC<VoteBreakdownProps> = ({ proposal, votes }) => {
  const totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes
  
  const getPercentage = (votes: number): number => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0
  }

  const forPercentage = getPercentage(proposal.forVotes)
  const againstPercentage = getPercentage(proposal.againstVotes)
  const abstainPercentage = getPercentage(proposal.abstainVotes)

  const getQuorumStatus = (): { achieved: boolean; current: number; required: number } => {
    // TODO: Calcular com base no total de ZARI em circulação
    const totalZari = 100000 // Mock
    const participation = (totalVotes / totalZari) * 100
    
    return {
      achieved: participation >= proposal.quorumRequired,
      current: participation,
      required: proposal.quorumRequired
    }
  }

  const getThresholdStatus = (): { achieved: boolean; current: number; required: number } => {
    const validVotes = proposal.forVotes + proposal.againstVotes
    const forPercentage = validVotes > 0 ? (proposal.forVotes / validVotes) * 100 : 0
    
    return {
      achieved: forPercentage > proposal.thresholdRequired,
      current: forPercentage,
      required: proposal.thresholdRequired
    }
  }

  const quorum = getQuorumStatus()
  const threshold = getThresholdStatus()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Resultado da Votação</h3>
      
      {/* Barras de Votação */}
      <div className="space-y-4 mb-6">
        {/* A favor */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-green-700">A favor</span>
            <span className="text-gray-600">
              {proposal.forVotes.toLocaleString()} ZARI ({forPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${forPercentage}%` }}
            />
          </div>
        </div>

        {/* Contra */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-red-700">Contra</span>
            <span className="text-gray-600">
              {proposal.againstVotes.toLocaleString()} ZARI ({againstPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-red-500 h-3 rounded-full transition-all"
              style={{ width: `${againstPercentage}%` }}
            />
          </div>
        </div>

        {/* Abstenção */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Abstenção</span>
            <span className="text-gray-600">
              {proposal.abstainVotes.toLocaleString()} ZARI ({abstainPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gray-500 h-3 rounded-full transition-all"
              style={{ width: `${abstainPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status de Quórum e Threshold */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Quórum</span>
            <span className={`px-2 py-1 rounded text-xs ${
              quorum.achieved 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {quorum.achieved ? 'Atingido' : 'Não atingido'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {quorum.current.toFixed(1)}% / {quorum.required}% necessário
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Threshold</span>
            <span className={`px-2 py-1 rounded text-xs ${
              threshold.achieved 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {threshold.achieved ? 'Aprovado' : 'Reprovado'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {threshold.current.toFixed(1)}% / {threshold.required}% necessário
          </div>
        </div>
      </div>

      {/* Lista de Votantes */}
      {votes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3">
            Votantes ({votes.length})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {votes.map((vote) => (
              <div key={vote.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">
                    {vote.voter.slice(0, 8)}...{vote.voter.slice(-6)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    vote.option === 'for' 
                      ? 'bg-green-100 text-green-800'
                      : vote.option === 'against'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vote.option === 'for' ? 'A favor' : 
                     vote.option === 'against' ? 'Contra' : 'Abstenção'}
                  </span>
                </div>
                <span className="text-gray-500">
                  {vote.weight.toLocaleString()} ZARI
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
