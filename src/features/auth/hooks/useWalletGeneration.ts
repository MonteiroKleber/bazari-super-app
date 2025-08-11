
// BEGIN ETAPA3-AUTH
import { useState, useCallback } from 'react'
import { authService } from '../services/authService'
import type { SeedPhraseValidation } from '@entities/account'

export function useWalletGeneration() {
  const [seedPhrase, setSeedPhrase] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [confirmationStep, setConfirmationStep] = useState<SeedPhraseValidation | null>(null)

  const generateNewSeedPhrase = useCallback(async () => {
    setIsGenerating(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      const sp = authService.generateSeedPhrase()
      setSeedPhrase(sp)
      return sp
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const startConfirmation = useCallback((phrase: string) => {
    const words = phrase.split(' ')
    const positions: number[] = []
    while (positions.length < 3) {
      const pos = Math.floor(Math.random() * words.length)
      if (!positions.includes(pos)) positions.push(pos)
    }
    positions.sort((a,b)=>a-b)
    setConfirmationStep({ phrase, positions, userInputs: new Array(3).fill('') })
  }, [])

  const updateConfirmationInput = useCallback((index: number, value: string) => {
    setConfirmationStep(prev => {
      if (!prev) return null
      const newInputs = [...prev.userInputs]
      newInputs[index] = value.toLowerCase().trim()
      return { ...prev, userInputs: newInputs }
    })
  }, [])

  const validateConfirmation = useCallback((): boolean => {
    if (!confirmationStep) return false
    const words = confirmationStep.phrase.split(' ')
    return confirmationStep.positions.every((pos, idx) => words[pos] === confirmationStep.userInputs[idx])
  }, [confirmationStep])

  const resetConfirmation = useCallback(() => setConfirmationStep(null), [])
  const reset = useCallback(() => { setSeedPhrase(''); setConfirmationStep(null) }, [])

  return {
    seedPhrase,
    isGenerating,
    confirmationStep,
    generateNewSeedPhrase,
    startConfirmation,
    updateConfirmationInput,
    validateConfirmation,
    resetConfirmation,
    reset,
    isConfirmationComplete: confirmationStep ? confirmationStep.userInputs.every(i => i.length > 0) : false
  }
}
// END ETAPA3-AUTH

