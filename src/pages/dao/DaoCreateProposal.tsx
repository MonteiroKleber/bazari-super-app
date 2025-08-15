// src/pages/dao/DaoCreateProposal.tsx

import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDAO } from '@features/dao/hooks/useDAO'
import { CreateProposalData, ProposalType, GOVERNANCE_CONSTANTS } from '@features/dao/types/dao.types'

export const DaoCreateProposal: FC = () => {
  const navigate = useNavigate()
  const { createProposal, loading, canCreateProposal } = useDAO()
  
  const [formData, setFormData] = useState<CreateProposalData>({
    title: '',
    description: '',
    type: ProposalType.GENERAL_PROPOSAL,
    actions: []
  })
  
  const [actionData, setActionData] = useState({
    type: 'transfer' as const,
    target: '',
    value: '',
    description: ''
  })
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  // TODO: Integrar com wallet para obter endereço real
  const mockUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
  const userCanCreate = canCreateProposal(mockUserAddress)

  const handleInputChange = (field: keyof CreateProposalData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddAction = () => {
    if (!actionData.description.trim()) {
      setError('Descrição da ação é obrigatória')
      return
    }

    const newAction = {
      type: actionData.type,
      target: actionData.target || undefined,
      value: actionData.value ? parseFloat(actionData.value) : undefined,
      description: actionData.description
    }

    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }))

    setActionData({
      type: 'transfer',
      target: '',
      value: '',
      description: ''
    })
  }

  const handleRemoveAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Título é obrigatório')
      return
    }

    if (!formData.description.trim()) {
      setError('Descrição é obrigatória')
      return
    }

    if (!userCanCreate) {
      setError(`Você precisa de pelo menos ${GOVERNANCE_CONSTANTS.MIN_STAKE_ZARI} ZARI para criar uma proposta`)
      return
    }

    try {
      const proposalId = await createProposal(formData)
      setSuccess(true)
      
      setTimeout(() => {
        navigate(`/dao/proposals/${proposalId}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar proposta')
    }
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-green-600 text-4xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Proposta criada com sucesso!
            </h2>
            <p className="text-green-700 mb-4">
              Sua proposta foi submetida e estará disponível para votação em breve.
            </p>
            <div className="text-sm text-green-600">
              Redirecionando para detalhes da proposta...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Criar Nova Proposta
          </h1>
          <p className="text-gray-600">
            Submeta uma proposta para votação da comunidade Bazari DAO
          </p>
        </div>

        {/* Requirements Check */}
        {!userCanCreate && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <span>⚠️</span>
              <span className="font-medium">Requisitos não atendidos</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Você precisa de pelo menos {GOVERNANCE_CONSTANTS.MIN_STAKE_ZARI} ZARI 
              para criar uma proposta. Isso serve como depósito de segurança.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Básicas
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Proposta *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Aumentar recompensas do pool BZR-ZARI"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/200 caracteres
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Proposta *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as ProposalType)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={ProposalType.GENERAL_PROPOSAL}>Proposta Geral</option>
                  <option value={ProposalType.TREASURY_WITHDRAWAL}>Retirada do Tesouro</option>
                  <option value={ProposalType.PARAMETER_CHANGE}>Mudança de Parâmetros</option>
                  <option value={ProposalType.PROTOCOL_UPGRADE}>Upgrade do Protocolo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva detalhadamente sua proposta, incluindo motivação, objetivos e impacto esperado..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={2000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/2000 caracteres
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ações da Proposta
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Defina as ações específicas que serão executadas se a proposta for aprovada.
            </p>

            {/* Add Action Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-3">Adicionar Ação</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Ação
                  </label>
                  <select
                    value={actionData.type}
                    onChange={(e) => setActionData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="transfer">Transferência</option>
                    <option value="parameter_change">Mudança de Parâmetro</option>
                    <option value="contract_call">Chamada de Contrato</option>
                  </select>
                </div>

                {actionData.type === 'transfer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço de Destino
                      </label>
                      <input
                        type="text"
                        value={actionData.target}
                        onChange={(e) => setActionData(prev => ({ ...prev, target: e.target.value }))}
                        placeholder="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor (BZR)
                      </label>
                      <input
                        type="number"
                        value={actionData.value}
                        onChange={(e) => setActionData(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição da Ação *
                </label>
                <input
                  type="text"
                  value={actionData.description}
                  onChange={(e) => setActionData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Transferir 5000 BZR para marketing e parcerias"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <button
                type="button"
                onClick={handleAddAction}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Adicionar Ação
              </button>
            </div>

            {/* Actions List */}
            {formData.actions.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Ações Adicionadas ({formData.actions.length})
                </h3>
                <div className="space-y-2">
                  {formData.actions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded border p-3">
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {action.type === 'transfer' ? 'Transferência' :
                           action.type === 'parameter_change' ? 'Mudança de Parâmetro' :
                           'Chamada de Contrato'}
                        </div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                        {action.value && (
                          <div className="text-sm text-gray-800">
                            Valor: {action.value.toLocaleString()} BZR
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAction(index)}
                        className="ml-3 px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Requirements Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">📋 Requisitos e Processo</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Depósito necessário: {GOVERNANCE_CONSTANTS.PROPOSAL_DEPOSIT} ZARI (reembolsável se aprovada)</li>
              <li>• Delay para votação: {GOVERNANCE_CONSTANTS.VOTING_DELAY_MINUTES} minutos após criação</li>
              <li>• Período de votação: {GOVERNANCE_CONSTANTS.VOTING_PERIOD_MINUTES / 1440} dias</li>
              <li>• Quórum mínimo: {GOVERNANCE_CONSTANTS.QUORUM_PERCENT}% dos tokens em circulação</li>
              <li>• Threshold de aprovação: {GOVERNANCE_CONSTANTS.THRESHOLD_PERCENT}% dos votos válidos</li>
              <li>• Timelock para execução: {GOVERNANCE_CONSTANTS.TIMELOCK_MINUTES / 1440} dias após aprovação</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-600">❌ {error}</div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dao/proposals')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !userCanCreate}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Criando Proposta...' : 
               !userCanCreate ? 'ZARI Insuficiente' :
               'Criar Proposta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


