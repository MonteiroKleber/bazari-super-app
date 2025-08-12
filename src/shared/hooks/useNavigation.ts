import { useNavigate } from 'react-router-dom'
import { startTransition, useCallback } from 'react'

export const useNavigation = () => {
  const navigate = useNavigate()

  const navigateWithTransition = useCallback((to: string, options?: any) => {
    startTransition(() => {
      navigate(to, options)
    })
  }, [navigate])

  return {
    navigate: navigateWithTransition,
    navigateSync: navigate, // Para casos especiais
  }
}