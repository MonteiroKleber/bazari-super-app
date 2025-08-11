import { useCallback } from 'react'
import { useProfileStore } from '../store/profileStore'
import type { User, UserTokenMetadata } from '@entities/user'

export function useProfile(userId?: string) {
  const {
    currentProfile,
    isLoading,
    error,
    isEditing,
    editingData,
    hasUnsavedChanges,
    avatarUploading,
    uploadProgress,
    tokenizing,
    tokenizationProgress,
    loadProfile,
    updateProfile,
    uploadAvatar,
    startEditing,
    cancelEditing,
    saveEditing,
    updateEditingData,
    tokenizeProfile,
    updateTokenMetadata,
    clearError
  } = useProfileStore()

  const handleLoadProfile = useCallback(() => {
    return loadProfile(userId)
  }, [loadProfile, userId])

  const handleUpdateProfile = useCallback((updates: Partial<User>) => {
    return updateProfile(updates)
  }, [updateProfile])

  const handleUploadAvatar = useCallback((file: File) => {
    return uploadAvatar(file)
  }, [uploadAvatar])

  const handleTokenizeProfile = useCallback((metadata: UserTokenMetadata) => {
    return tokenizeProfile(metadata)
  }, [tokenizeProfile])

  return {
    // Estado
    profile: currentProfile,
    isLoading,
    error,
    isEditing,
    editingData,
    hasUnsavedChanges,
    avatarUploading,
    uploadProgress,
    tokenizing,
    tokenizationProgress,

    // Ações básicas
    loadProfile: handleLoadProfile,
    updateProfile: handleUpdateProfile,
    uploadAvatar: handleUploadAvatar,

    // Ações de edição
    startEditing,
    cancelEditing,
    saveEditing,
    updateEditingData,

    // Ações de tokenização
    tokenizeProfile: handleTokenizeProfile,
    updateTokenMetadata,

    // Utilitários
    clearError,
    isOwner: !userId || (currentProfile?.id === userId),
    canEdit: !userId || (currentProfile?.id === userId),
    hasAvatar: !!currentProfile?.avatar,
    isTokenized: !!currentProfile?.isTokenized,
    marketValue: currentProfile?.marketValue || 0
  }
}
