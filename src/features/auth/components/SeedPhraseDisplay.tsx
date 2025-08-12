import { FC, useState, useEffect } from 'react'
import { useWalletGeneration } from '../hooks/useWalletGeneration'

interface SeedPhraseDisplayProps {
  onContinue: () => void
}

export const SeedPhraseDisplay: FC<SeedPhraseDisplayProps> = ({ onContinue }) => {
  const { 
    seedPhrase, 
    startConfirmation, 
    generateNewSeedPhrase, 
    isGenerating,
    confirmationStep // ✅ ADICIONADO: Para debug
  } = useWalletGeneration()
  
  const [isRevealed, setIsRevealed] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')

  useEffect(() => {
    console.log('🔧 DEBUG: SeedPhraseDisplay mounted, seedPhrase:', seedPhrase || 'VAZIA!')
    
    if (!seedPhrase || seedPhrase.trim() === '') {
      console.log('🔧 DEBUG: Seed phrase vazia, gerando nova...')
      generateNewSeedPhrase()
        .then((newSeed) => {
          console.log('🔧 DEBUG: Nova seed phrase gerada:', newSeed?.substring(0, 20) + '...')
        })
        .catch((error) => {
          console.error('❌ ERROR: Falha ao gerar seed phrase:', error)
        })
    } else {
      console.log('🔧 DEBUG: Seed phrase já existe:', seedPhrase.substring(0, 20) + '...')
    }
  }, [seedPhrase, generateNewSeedPhrase])

  // ✅ ADICIONADO: Debug do confirmationStep
  useEffect(() => {
    console.log('🔧 DEBUG: confirmationStep mudou:', confirmationStep)
  }, [confirmationStep])

  if (isGenerating) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Gerando sua frase de recuperação...</p>
      </div>
    )
  }

  if (!seedPhrase || seedPhrase.trim() === '') {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">❌ Erro ao gerar frase de recuperação</p>
        </div>
        <button 
          onClick={() => generateNewSeedPhrase()}
          className="btn-primary"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  const words = seedPhrase.split(' ')

  const handleReveal = () => setIsRevealed(true)
  
  const handleCopyToClipboard = async () => {
    setCopyStatus('copying')
    try {
      await navigator.clipboard.writeText(seedPhrase)
      setCopyStatus('success')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
      setCopyStatus('error')
      try {
        const textArea = document.createElement('textarea')
        textArea.value = seedPhrase
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopyStatus('success')
        setTimeout(() => setCopyStatus('idle'), 2000)
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
        setTimeout(() => setCopyStatus('idle'), 2000)
      }
    }
  }
  
  // ✅ CORREÇÃO: Aumentar delay e adicionar validação
  const handleContinue = () => {
    console.log('🔧 DEBUG: handleContinue chamado')
    console.log('🔧 DEBUG: seedPhrase atual:', seedPhrase.substring(0, 20) + '...')
    
    // Chama startConfirmation
    startConfirmation(seedPhrase)
    
    // ✅ CORREÇÃO: Delay maior e validação antes de navegar
    setTimeout(() => {
      console.log('🔧 DEBUG: Após startConfirmation, confirmationStep:', confirmationStep)
      
      // ✅ BACKUP: Salvar no localStorage como fallback
      try {
        const backupData = {
          phrase: seedPhrase,
          timestamp: Date.now()
        }
        localStorage.setItem('bazari_confirmation_backup', JSON.stringify(backupData))
        console.log('🔧 DEBUG: Backup salvo no localStorage')
      } catch (error) {
        console.error('⚠️ WARNING: Falha ao salvar backup:', error)
      }
      
      console.log('🔧 DEBUG: Navegando para confirmação...')
      onContinue()
    }, 100) // ✅ CORREÇÃO: Aumentou de 0ms para 100ms
  }

  const getCopyButtonText = () => {
    switch (copyStatus) {
      case 'copying': return '📋 Copiando...'
      case 'success': return '✅ Copiado!'
      case 'error': return '❌ Erro - Tente novamente'
      default: return '📋 Copiar para área de transferência'
    }
  }

  return (
    <div className="space-y-6">
      {/* Debug info */}
      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
        🔧 DEBUG: Seed={words.length} palavras | Status={isRevealed ? 'Revelada' : 'Oculta'} | 
        ConfirmStep={confirmationStep ? 'OK' : 'NULL'}
      </div>

      <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
        <div className="text-sm text-warning-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>Nunca compartilhe sua frase de recuperação</li>
            <li>Anote em local seguro</li>
            <li>Não perca sua frase — ela é sua conta</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {!isRevealed ? (
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-8 mb-4">
              <p className="text-gray-600">Clique para revelar sua seed phrase</p>
            </div>
            <button onClick={handleReveal} className="btn-primary">
              Revelar seed phrase
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {words.map((word, index) => (
                  <div key={index} className="bg-white rounded px-3 py-2 text-center text-sm border">
                    <span className="text-gray-500 text-xs">{index + 1}.</span>
                    <span className="ml-1 font-medium">{word}</span>
                  </div>
                ))}
              </div>
              
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleCopyToClipboard()
                }}
                disabled={copyStatus === 'copying'}
                className={`w-full text-sm py-2 transition-colors ${
                  copyStatus === 'success' ? 'text-green-600' :
                  copyStatus === 'error' ? 'text-red-600' :
                  'text-primary-600 hover:text-primary-500'
                } disabled:opacity-50`}
              >
                {getCopyButtonText()}
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="confirmed"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="confirmed" className="ml-2 block text-sm text-gray-900">
                Confirmo que salvei minha seed phrase
              </label>
            </div>
          </div>
        )}
      </div>

      {isRevealed && (
        <button 
          onClick={handleContinue} 
          disabled={!isConfirmed} 
          className="w-full btn-primary disabled:opacity-50"
        >
          Continuar
        </button>
      )}
    </div>
  )
}