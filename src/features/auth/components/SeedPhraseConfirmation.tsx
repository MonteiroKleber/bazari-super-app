
// BEGIN ETAPA3-AUTH
import { FC } from 'react'
import { useWalletGeneration } from '../hooks/useWalletGeneration'
// import { useAuthTranslation } from '@shared/hooks/useTranslation'
const T = (k:string)=>k

interface SeedPhraseConfirmationProps {
  onConfirm: () => void
  onBack: () => void
}

export const SeedPhraseConfirmation: FC<SeedPhraseConfirmationProps> = ({
  onConfirm,
  onBack
}) => {
  // const { t } = useAuthTranslation()
  const t = T
  const {
    confirmationStep,
    updateConfirmationInput,
    validateConfirmation,
    isConfirmationComplete
  } = useWalletGeneration()

  if (!confirmationStep) return null

  const handleConfirm = () => {
    if (validateConfirmation()) onConfirm()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('confirmSeedPhrase')}
        </h3>
        <p className="text-gray-600">
          {t('confirmSeedPhraseDescription')}
        </p>
      </div>

      <div className="space-y-4">
        {confirmationStep.positions.map((position, index) => (
          <div key={position}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('wordAtPosition', { position: position + 1 } as any)}
            </label>
            <input
              type="text"
              value={confirmationStep.userInputs[index]}
              onChange={(e) => updateConfirmationInput(index, e.target.value)}
              className="w-full input-bazari"
              placeholder={t('enterWord')}
              autoComplete="off"
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button type="button" onClick={onBack} className="flex-1 btn-secondary">
          {t('back')}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!isConfirmationComplete || !validateConfirmation()}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          {t('confirm')}
        </button>
      </div>
    </div>
  )
}
// END ETAPA3-AUTH

