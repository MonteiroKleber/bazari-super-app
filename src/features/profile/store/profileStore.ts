import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserTokenMetadata } from '@entities/user'

interface ProfileState {
  // Estado do perfil
  currentProfile: User | null
  profileCache: Map<string, User>
  isLoading: boolean
  error: string | null
  
  // Estado de edição
  isEditing: boolean
  editingData: Partial<User> | null
  hasUnsavedChanges: boolean
  
  // Estado de upload
  avatarUploading: boolean
  uploadProgress: number
  
  // Estado de tokenização
  tokenizing: boolean
  tokenizationProgress: number

  // Ações de perfil
  loadProfile: (userId?: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<string>
  
  // Ações de edição
  startEditing: (initialData?: Partial<User>) => void
  cancelEditing: () => void
  saveEditing: () => Promise<boolean>
  updateEditingData: (updates: Partial<User>) => void
  
  // Ações de tokenização
  tokenizeProfile: (metadata: UserTokenMetadata) => Promise<boolean>
  updateTokenMetadata: (metadata: Partial<UserTokenMetadata>) => Promise<boolean>
  
  // Ações de cache
  cacheProfile: (profile: User) => void
  getCachedProfile: (userId: string) => User | null
  clearCache: () => void
  
  // Utilitários
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      currentProfile: null,
      profileCache: new Map(),
      isLoading: false,
      error: null,
      isEditing: false,
      editingData: null,
      hasUnsavedChanges: false,
      avatarUploading: false,
      uploadProgress: 0,
      tokenizing: false,
      tokenizationProgress: 0,

      loadProfile: async (userId?: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Se não especificar userId, carrega perfil atual
          if (!userId) {
            // Aqui carregaria do serviço de autenticação
            const authService = await import('@features/auth/store/authStore')
            const currentAccount = authService.useAuthStore.getState().currentAccount
            
            if (!currentAccount) {
              throw new Error('Usuário não autenticado')
            }
            
            userId = currentAccount.id
          }

          // Verifica cache primeiro
          const cached = get().getCachedProfile(userId)
          if (cached) {
            set({ currentProfile: cached, isLoading: false })
            return
          }

          // Carrega do serviço
          const profileService = await import('../services/profileService')
          const profile = await profileService.profileService.getProfile(userId)
          
          set({ 
            currentProfile: profile,
            isLoading: false
          })
          
          // Adiciona ao cache
          get().cacheProfile(profile)
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao carregar perfil',
            isLoading: false 
          })
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { currentProfile } = get()
        if (!currentProfile) {
          set({ error: 'Nenhum perfil carregado' })
          return false
        }

        set({ isLoading: true, error: null })
        
        try {
          const profileService = await import('../services/profileService')
          const updatedProfile = await profileService.profileService.updateProfile(
            currentProfile.id,
            updates
          )
          
          set({ 
            currentProfile: updatedProfile,
            isLoading: false,
            hasUnsavedChanges: false
          })
          
          // Atualiza cache
          get().cacheProfile(updatedProfile)
          
          return true
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
            isLoading: false 
          })
          return false
        }
      },

      uploadAvatar: async (file: File) => {
        set({ avatarUploading: true, uploadProgress: 0, error: null })
        
        try {
          const ipfsService = await import('@services/ipfs/ipfsService')
          
          const avatarHash = await ipfsService.ipfsService.uploadImage(
            file,
            { maxWidth: 400, maxHeight: 400, quality: 0.8 },
            (progress) => {
              set({ uploadProgress: progress.percentage })
            }
          )
          
          const avatarURL = ipfsService.ipfsService.getOptimizedImageURL(avatarHash)
          
          // Atualiza perfil com novo avatar
          const success = await get().updateProfile({ avatar: avatarURL })
          
          set({ avatarUploading: false, uploadProgress: 0 })
          
          if (success) {
            return avatarURL
          } else {
            throw new Error('Falha ao atualizar perfil com novo avatar')
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro no upload do avatar',
            avatarUploading: false,
            uploadProgress: 0
          })
          throw error
        }
      },

      startEditing: (initialData?: Partial<User>) => {
        const { currentProfile } = get()
        
        set({
          isEditing: true,
          editingData: initialData || { ...currentProfile },
          hasUnsavedChanges: false
        })
      },

      cancelEditing: () => {
        set({
          isEditing: false,
          editingData: null,
          hasUnsavedChanges: false
        })
      },

      saveEditing: async () => {
        const { editingData } = get()
        if (!editingData) return false
        
        const success = await get().updateProfile(editingData)
        
        if (success) {
          set({
            isEditing: false,
            editingData: null,
            hasUnsavedChanges: false
          })
        }
        
        return success
      },

      updateEditingData: (updates: Partial<User>) => {
        set(state => ({
          editingData: { ...state.editingData, ...updates },
          hasUnsavedChanges: true
        }))
      },

      tokenizeProfile: async (metadata: UserTokenMetadata) => {
        set({ tokenizing: true, tokenizationProgress: 0, error: null })
        
        try {
          const tokenizationService = await import('../services/tokenizationService')
          
          const tokenData = await tokenizationService.tokenizationService.tokenizeProfile(
            metadata,
            (progress) => {
              set({ tokenizationProgress: progress })
            }
          )
          
          // Atualiza perfil com dados de tokenização
          const success = await get().updateProfile({
            isTokenized: true,
            tokenId: tokenData.tokenId,
            tokenContractAddress: tokenData.contractAddress,
            tokenMetadata: metadata
          })
          
          set({ tokenizing: false, tokenizationProgress: 0 })
          
          return success
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro na tokenização',
            tokenizing: false,
            tokenizationProgress: 0
          })
          return false
        }
      },

      updateTokenMetadata: async (metadata: Partial<UserTokenMetadata>) => {
        const { currentProfile } = get()
        if (!currentProfile?.isTokenized || !currentProfile.tokenMetadata) {
          set({ error: 'Perfil não tokenizado' })
          return false
        }

        const updatedMetadata = { ...currentProfile.tokenMetadata, ...metadata }
        return get().updateProfile({ tokenMetadata: updatedMetadata })
      },

      cacheProfile: (profile: User) => {
        set(state => {
          const newCache = new Map(state.profileCache)
          newCache.set(profile.id, profile)
          return { profileCache: newCache }
        })
      },

      getCachedProfile: (userId: string) => {
        return get().profileCache.get(userId) || null
      },

      clearCache: () => {
        set({ profileCache: new Map() })
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'bazari-profile',
      partialize: (state) => ({
        profileCache: Array.from(state.profileCache.entries())
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.profileCache) {
          // Reconstrói Map do cache a partir do array
          state.profileCache = new Map(state.profileCache as any)
        }
      }
    }
  )
)
