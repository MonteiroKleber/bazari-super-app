import { useState, useCallback } from 'react'
import { tokenizationService } from '../services/tokenizationService'
import type { UserTokenMetadata } from '@entities/user'

export function useTokenization() {
  const [tokenizing, setTokenizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [tokenData, setTokenData] = useState<{
    tokenId: string
    contractAddress: string
    transactionHash: string
  } | null>(null)

  const tokenizeProfile = useCallback(async (metadata: UserTokenMetadata) => {
    setTokenizing(true)
    setError(null)
    setProgress(0)

    try {
      const result = await tokenizationService.tokenizeProfile(
        metadata,
        (progressValue) => {
          setProgress(progressValue)
        }
      )

      setTokenData({
        tokenId: result.tokenId,
        contractAddress: result.contractAddress,
        transactionHash: result.transactionHash
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na tokenização'
      setError(errorMessage)
      throw error
    } finally {
      setTokenizing(false)
    }
  }, [])

  const updateTokenMetadata = useCallback(async (
    tokenId: string,
    newMetadata: UserTokenMetadata
  ) => {
    setTokenizing(true)
    setError(null)

    try {
      const success = await tokenizationService.updateTokenMetadata(tokenId, newMetadata)
      return success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na atualização'
      setError(errorMessage)
      return false
    } finally {
      setTokenizing(false)
    }
  }, [])

  const checkTokenizationEligibility = useCallback((profileData: {
    name: string
    bio?: string
    avatar?: string
    reputation: { overall: number }
  }) => {
    return tokenizationService.canTokenizeProfile(profileData)
  }, [])

  const generateDefaultMetadata = useCallback((profileData: any) => {
    return tokenizationService.generateDefaultTokenMetadata(profileData)
  }, [])

  const reset = useCallback(() => {
    setTokenizing(false)
    setProgress(0)
    setError(null)
    setTokenData(null)
  }, [])

  return {
    tokenizing,
    progress,
    error,
    tokenData,
    tokenizeProfile,
    updateTokenMetadata,
    checkTokenizationEligibility,
    generateDefaultMetadata,
    reset,
    isComplete: !!tokenData
  }
}
