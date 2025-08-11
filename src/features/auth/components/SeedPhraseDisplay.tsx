import { FC, useState } from 'react'
import { useWalletGeneration } from '../hooks/useWalletGeneration'

interface SeedPhraseDisplayProps {
  onContinue: () => void
}

export const SeedPhraseDisplay: FC<SeedPhraseDisplayProps> = ({ onContinue }) => {
  const { seedPhrase, startConfirmation } = useWalletGeneration()
  const [isRevealed, setIsRevealed] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const words = seedPhrase.split(' ')

  const handleReveal = () => setIsRevealed(true)
  const handleCopyToClipboard = async () => {
    try { await navigator.clipboard.writeText(seedPhrase) } catch {}
  }
  const handleContinue = () => { startConfirmation(seedPhrase); onContinue() }

  return (
    <div className="space-y-6">
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
            <button onClick={handleReveal} className="btn-primary">Revelar seed phrase</button>
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
              <button onClick={handleCopyToClipboard} className="w-full text-primary-600 hover:text-primary-500 text-sm py-2">
                📋 Copiar para área de transferência
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
        <button onClick={handleContinue} disabled={!isConfirmed} className="w-full btn-primary disabled:opacity-50">
          Continuar
        </button>
      )}
    </div>
  )
}
