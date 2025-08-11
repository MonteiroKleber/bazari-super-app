
// BEGIN ETAPA3-AUTH
import { useState, useCallback } from 'react'
import { authService } from '../services/authService'

interface FormState {
  isValid: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}

export function useAuthForm() {
  const [formState, setFormState] = useState<FormState>({
    isValid: false,
    errors: {},
    touched: {}
  })

  const validatePassword = useCallback((password: string): string | null => {
    if (!password) return 'Senha é obrigatória'
    if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Senha deve conter ao menos: 1 minúscula, 1 maiúscula e 1 número'
    }
    return null
  }, [])

  const validatePasswordConfirmation = useCallback((password: string, confirmation: string): string | null => {
    if (!confirmation) return 'Confirmação de senha é obrigatória'
    if (password !== confirmation) return 'Senhas não coincidem'
    return null
  }, [])

  const validateSeedPhrase = useCallback((seedPhrase: string): string | null => {
    if (!seedPhrase) return 'Seed phrase é obrigatória'
    if (!authService.validateSeedPhrase(seedPhrase)) return 'Seed phrase deve ter 12 ou 24 palavras'
    return null
  }, [])

  const validateField = useCallback((name: string, value: string, extraData?: any): string | null => {
    switch (name) {
      case 'password': return validatePassword(value)
      case 'confirmPassword': return validatePasswordConfirmation(extraData?.password || '', value)
      case 'seedPhrase': return validateSeedPhrase(value)
      case 'accountName': return !value ? 'Nome da conta é obrigatório' : null
      default: return null
    }
  }, [validatePassword, validatePasswordConfirmation, validateSeedPhrase])

  const setFieldError = useCallback((field: string, error: string | null) => {
    const nextErrors = (prev: Record<string,string>) => ({ ...prev, [field]: error || '' })
    setFormState(prev => {
      const errors = nextErrors(prev.errors)
      const isValid = Object.values(errors).every(e => !e)
      return { ...prev, errors, isValid }
    })
  }, [])

  const setFieldTouched = useCallback((field: string, touched = true) => {
    setFormState(prev => ({ ...prev, touched: { ...prev.touched, [field]: touched } }))
  }, [])

  const resetForm = useCallback(() => {
    setFormState({ isValid: false, errors: {}, touched: {} })
  }, [])

  return {
    formState,
    validateField,
    setFieldError,
    setFieldTouched,
    resetForm,
    validatePassword,
    validatePasswordConfirmation,
    validateSeedPhrase
  }
}
// END ETAPA3-AUTH

