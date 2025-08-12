import { useState, useCallback, useRef } from 'react'
import { authService } from '../services/authService'
import type { SeedPhraseValidation } from '@entities/account'

export function useWalletGeneration() {
  const [seedPhrase, setSeedPhrase] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [confirmationStep, setConfirmationStep] = useState<SeedPhraseValidation | null>(null)
  
  // ✅ CORREÇÃO: useRef para evitar chamadas duplicadas
  const confirmationRef = useRef<SeedPhraseValidation | null>(null)

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

  // ✅ CORREÇÃO: Melhor tratamento de posições e debug logs
  const startConfirmation = useCallback((phrase: string) => {
    console.log('🔧 DEBUG: startConfirmation called with phrase:', phrase.substring(0, 20) + '...')
    
    const words = phrase.trim().split(' ')
    console.log('🔧 DEBUG: phrase has', words.length, 'words')
    
    if (words.length < 3) {
      console.error('❌ ERROR: Phrase too short:', words.length, 'words')
      return
    }

    const positions: number[] = []
    while (positions.length < 3) {
      const pos = Math.floor(Math.random() * words.length)
      if (!positions.includes(pos)) {
        positions.push(pos)
      }
    }
    positions.sort((a, b) => a - b)
    
    const validation: SeedPhraseValidation = {
      phrase,
      positions,
      userInputs: new Array(3).fill('')
    }
    
    console.log('🔧 DEBUG: setting confirmationStep:', {
      positions,
      userInputsLength: validation.userInputs.length
    })
    
    // ✅ CORREÇÃO: Atualizar tanto state quanto ref
    confirmationRef.current = validation
    setConfirmationStep(validation)
  }, [])

  const updateConfirmationInput = useCallback((index: number, value: string) => {
    setConfirmationStep(prev => {
      if (!prev) {
        console.warn('⚠️ WARNING: updateConfirmationInput called but confirmationStep is null')
        return null
      }
      
      const newInputs = [...prev.userInputs]
      newInputs[index] = value.toLowerCase().trim()
      
      const updated = { ...prev, userInputs: newInputs }
      confirmationRef.current = updated
      return updated
    })
  }, [])

  const validateConfirmation = useCallback((): boolean => {
    const current = confirmationStep || confirmationRef.current
    if (!current) {
      console.warn('⚠️ WARNING: validateConfirmation called but no confirmationStep')
      return false
    }
    
    const words = current.phrase.split(' ')
    const isValid = current.positions.every((pos, idx) => {
      const expectedWord = words[pos]?.toLowerCase()
      const userWord = current.userInputs[idx]?.toLowerCase()
      return expectedWord === userWord
    })
    
    console.log('🔧 DEBUG: validation result:', isValid)
    return isValid
  }, [confirmationStep])

  const resetConfirmation = useCallback(() => {
    confirmationRef.current = null
    setConfirmationStep(null)
  }, [])
  
  const reset = useCallback(() => {
    setSeedPhrase('')
    confirmationRef.current = null
    setConfirmationStep(null)
  }, [])

  const isConfirmationComplete = confirmationStep 
    ? confirmationStep.userInputs.every(input => input.length > 0)
    : false

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
    isConfirmationComplete
  }
}