import { FC, useEffect, useState } from 'react' // ✅ ADICIONADO: useState no import
import { useWalletGeneration } from '../hooks/useWalletGeneration'

interface SeedPhraseConfirmationProps {
  onConfirm: () => void
  onBack: () => void
}

export const SeedPhraseConfirmation: FC<SeedPhraseConfirmationProps> = ({
  onConfirm,
  onBack
}) => {
  const {
    confirmationStep,
    updateConfirmationInput,
    validateConfirmation,
    isConfirmationComplete,
    startConfirmation
  } = useWalletGeneration()

  // ✅ CORREÇÃO: useState no lugar correto (dentro do componente)
  const [showError, setShowError] = useState(false)

  // ✅ CORREÇÃO: Tentar recuperar do backup se confirmationStep for null
  useEffect(() => {
    console.log('🔧 DEBUG: SeedPhraseConfirmation mounted, confirmationStep:', confirmationStep)
    
    if (!confirmationStep) {
      console.log('🔧 DEBUG: confirmationStep é null, tentando recuperar backup...')
      
      try {
        const backupStr = localStorage.getItem('bazari_confirmation_backup')
        if (backupStr) {
          const backup = JSON.parse(backupStr)
          const timeDiff = Date.now() - backup.timestamp
          
          // ✅ Backup válido se foi criado nos últimos 5 minutos
          if (timeDiff < 5 * 60 * 1000 && backup.phrase) {
            console.log('🔧 DEBUG: Backup encontrado, restaurando confirmationStep...')
            startConfirmation(backup.phrase)
          } else {
            console.log('⚠️ WARNING: Backup muito antigo ou inválido')
            localStorage.removeItem('bazari_confirmation_backup')
          }
        } else {
          console.log('⚠️ WARNING: Nenhum backup encontrado')
        }
      } catch (error) {
        console.error('❌ ERROR: Falha ao recuperar backup:', error)
      }
    }
  }, [confirmationStep, startConfirmation])

  // ✅ CORREÇÃO: useEffect para controlar showError
  useEffect(() => {
    if (!confirmationStep) {
      const timer = setTimeout(() => {
        setShowError(true)
      }, 1000) // Aguarda 1 segundo antes de mostrar erro
      
      return () => clearTimeout(timer)
    } else {
      setShowError(false)
    }
  }, [confirmationStep])

  // ✅ LOADING: Mostrar loading se ainda não tem confirmationStep
  if (!confirmationStep && !showError) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dados de confirmação...</p>
      </div>
    )
  }

  // ✅ ERRO: Mostrar erro só depois do loading
  if (!confirmationStep && showError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">
            ❌ Erro: Dados de confirmação não encontrados. 
            Por favor, volte e tente novamente.
          </p>
        </div>
        
        {/* ✅ ADICIONADO: Botão para tentar recuperar manualmente */}
        <div className="text-center">
          <button 
            onClick={() => {
              console.log('🔧 DEBUG: Tentando recuperar backup manualmente...')
              const backupStr = localStorage.getItem('bazari_confirmation_backup')
              if (backupStr) {
                try {
                  const backup = JSON.parse(backupStr)
                  if (backup.phrase) {
                    startConfirmation(backup.phrase)
                  }
                } catch (error) {
                  console.error('❌ ERROR: Falha ao parsear backup:', error)
                }
              }
            }}
            className="btn-secondary mr-2"
          >
            Tentar Recuperar
          </button>
          <button onClick={onBack} className="btn-secondary">
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const handleConfirm = () => {
    if (validateConfirmation()) {
      // ✅ LIMPEZA: Remover backup após sucesso
      localStorage.removeItem('bazari_confirmation_backup')
      onConfirm()
    } else {
      alert('Uma ou mais palavras estão incorretas. Verifique e tente novamente.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Debug info */}
      <div className="text-xs text-gray-500 bg-green-50 p-2 rounded">
        🔧 DEBUG: Posições {confirmationStep.positions.map(p => p + 1).join(', ')} | 
        Preenchidos: {confirmationStep.userInputs.filter(i => i.length > 0).length}/3
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirmar Frase de Recuperação
        </h3>
        <p className="text-gray-600">
          Digite as palavras solicitadas para confirmar que salvou sua frase corretamente
        </p>
      </div>

      <div className="space-y-4">
        {confirmationStep.positions.map((position, index) => (
          <div key={position}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palavra {position + 1}
            </label>
            <input
              type="text"
              value={confirmationStep.userInputs[index]}
              onChange={(e) => updateConfirmationInput(index, e.target.value)}
              className="w-full input-bazari"
              placeholder={`Digite a palavra ${position + 1}`}
              autoComplete="off"
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button type="button" onClick={onBack} className="flex-1 btn-secondary">
          Voltar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!isConfirmationComplete}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}