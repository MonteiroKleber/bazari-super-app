import { nanoid } from 'nanoid'
import type { User, UserTokenMetadata, ReputationScore } from '@entities/user'
import { ipfsService } from '@services/ipfs/ipfsService'

interface ProfileUpdateData {
  name?: string
  bio?: string
  email?: string
  phone?: string
  location?: string
  website?: string
  avatar?: string
  settings?: Partial<User['settings']>
}

interface SearchFilters {
  location?: string
  isTokenized?: boolean
  minReputation?: number
  hasAvatar?: boolean
  isVerified?: boolean
}

export class ProfileService {
  private profiles: Map<string, User> = new Map()

  /**
   * Obtém perfil por ID
   */
  async getProfile(userId: string): Promise<User> {
    try {
      // Simula busca no banco/blockchain
      const cachedProfile = this.profiles.get(userId)
      if (cachedProfile) {
        return { ...cachedProfile, lastActiveAt: new Date() }
      }

      // Simula perfil padrão para desenvolvimento
      const defaultProfile: User = {
        id: userId,
        address: `5${userId.slice(0, 30)}...`,
        name: 'Usuário Bazari',
        bio: 'Bem-vindo ao Bazari! 🚀',
        avatar: undefined,
        email: undefined,
        phone: undefined,
        location: undefined,
        website: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: new Date(),
        
        isTokenized: false,
        tokenId: undefined,
        tokenContractAddress: undefined,
        marketValue: 0,
        tokenMetadata: undefined,
        
        reputation: {
          overall: 75,
          trading: 80,
          social: 70,
          community: 75,
          details: {
            totalTransactions: 12,
            successfulDeals: 11,
            averageRating: 4.5,
            reviewsCount: 8,
            endorsements: 15
          }
        },
        followersCount: 156,
        followingCount: 89,
        postsCount: 24,
        
        stats: {
          totalEarnings: 2500.75,
          totalSpent: 1800.25,
          businessesOwned: 1,
          productsListed: 5,
          servicesOffered: 2,
          socialInteractions: 342,
          daoParticipation: 12
        },
        
        settings: {
          language: 'pt',
          theme: 'light',
          currency: 'BZR',
          notifications: {
            email: true,
            push: true,
            social: true,
            marketplace: true,
            dao: true,
            wallet: true
          },
          privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false,
            showLocation: true,
            allowMessages: true
          },
          profile: {
            showEmail: false,
            showPhone: false,
            showLocation: true,
            showWebsite: true,
            showStats: true,
            showBadges: true,
            allowMessages: true,
            allowFollows: true,
            autoTokenizeContent: false
          }
        },
        
        isVerified: false,
        badges: [
          {
            id: nanoid(),
            type: 'achievement',
            name: 'Primeiro Post',
            description: 'Fez sua primeira publicação',
            icon: '📝',
            color: '#10B981',
            earnedAt: new Date(),
            isVisible: true
          },
          {
            id: nanoid(),
            type: 'verification',
            name: 'Comerciante Verificado',
            description: 'Perfil verificado para comércio',
            icon: '✅',
            color: '#3B82F6',
            earnedAt: new Date(),
            isVisible: true
          }
        ],
        
        profileVisibility: 'public'
      }

      this.profiles.set(userId, defaultProfile)
      return defaultProfile
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      throw new Error('Falha ao carregar perfil do usuário')
    }
  }

  /**
   * Atualiza perfil
   */
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<User> {
    try {
      const currentProfile = await this.getProfile(userId)
      
      const updatedProfile: User = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date()
      }

      // Valida dados de entrada
      this.validateProfileData(updatedProfile)

      // Simula persistência
      this.profiles.set(userId, updatedProfile)
      
      return updatedProfile
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw new Error('Falha ao atualizar perfil')
    }
  }

  /**
   * Busca usuários
   */
  async searchUsers(
    query: string, 
    filters: SearchFilters = {},
    limit: number = 20
  ): Promise<User[]> {
    try {
      // Simula busca de usuários
      const allUsers = Array.from(this.profiles.values())
      
      let results = allUsers.filter(user => {
        // Busca por nome, bio ou localização
        const searchTerm = query.toLowerCase()
        const nameMatch = user.name.toLowerCase().includes(searchTerm)
        const bioMatch = user.bio?.toLowerCase().includes(searchTerm) || false
        const locationMatch = user.location?.toLowerCase().includes(searchTerm) || false
        
        return nameMatch || bioMatch || locationMatch
      })

      // Aplica filtros
      if (filters.location) {
        results = results.filter(user => 
          user.location?.toLowerCase().includes(filters.location!.toLowerCase())
        )
      }

      if (filters.isTokenized !== undefined) {
        results = results.filter(user => user.isTokenized === filters.isTokenized)
      }

      if (filters.minReputation) {
        results = results.filter(user => 
          user.reputation.overall >= filters.minReputation!
        )
      }

      if (filters.hasAvatar) {
        results = results.filter(user => !!user.avatar)
      }

      if (filters.isVerified) {
        results = results.filter(user => user.isVerified)
      }

      // Ordena por relevância (reputação + followers)
      results.sort((a, b) => {
        const scoreA = a.reputation.overall + (a.followersCount / 100)
        const scoreB = b.reputation.overall + (b.followersCount / 100)
        return scoreB - scoreA
      })

      return results.slice(0, limit)
    } catch (error) {
      console.error('Erro na busca de usuários:', error)
      throw new Error('Falha na busca de usuários')
    }
  }

  /**
   * Obtém estatísticas de reputação
   */
  async calculateReputation(userId: string): Promise<ReputationScore> {
    try {
      // Simula cálculo de reputação baseado em atividades
      const profile = await this.getProfile(userId)
      
      // Fórmulas de reputação (em produção usar dados reais)
      const tradingScore = Math.min(100, (profile.stats.totalEarnings / 100) * 10)
      const socialScore = Math.min(100, (profile.followersCount / 10) + (profile.postsCount * 2))
      const communityScore = Math.min(100, profile.stats.daoParticipation * 5)
      const overallScore = (tradingScore + socialScore + communityScore) / 3

      return {
        overall: Math.round(overallScore),
        trading: Math.round(tradingScore),
        social: Math.round(socialScore),
        community: Math.round(communityScore),
        details: profile.reputation.details
      }
    } catch (error) {
      console.error('Erro no cálculo de reputação:', error)
      throw new Error('Falha no cálculo de reputação')
    }
  }

  /**
   * Valida dados do perfil
   */
  private validateProfileData(profile: Partial<User>): void {
    if (profile.name && (profile.name.length < 2 || profile.name.length > 50)) {
      throw new Error('Nome deve ter entre 2 e 50 caracteres')
    }

    if (profile.bio && profile.bio.length > 500) {
      throw new Error('Bio deve ter no máximo 500 caracteres')
    }

    if (profile.email && !this.isValidEmail(profile.email)) {
      throw new Error('Email inválido')
    }

    if (profile.website && !this.isValidURL(profile.website)) {
      throw new Error('Website inválido')
    }
  }

  /**
   * Valida email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Valida URL
   */
  private isValidURL(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

export const profileService = new ProfileService()
