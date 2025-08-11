import { nanoid } from 'nanoid'
import type { UserTokenMetadata } from '@entities/user'
import { ipfsService } from '@services/ipfs/ipfsService'

interface TokenizationResult {
  tokenId: string
  contractAddress: string
  transactionHash: string
  metadataHash: string
}

interface TokenizationProgress {
  step: 'uploading' | 'minting' | 'completing'
  percentage: number
  message: string
}

export class TokenizationService {
  /**
   * Tokeniza perfil de usuário
   */
  async tokenizeProfile(
    metadata: UserTokenMetadata,
    onProgress?: (progress: number) => void
  ): Promise<TokenizationResult> {
    try {
      // Passo 1: Upload de metadata para IPFS (30%)
      onProgress?.(10)
      const metadataHash = await ipfsService.uploadProfileMetadata(metadata)
      onProgress?.(30)

      // Passo 2: Criação do NFT na blockchain (70%)
      onProgress?.(50)
      const tokenResult = await this.mintProfileNFT(metadataHash, metadata)
      onProgress?.(80)

      // Passo 3: Finalização (100%)
      onProgress?.(100)

      return {
        tokenId: tokenResult.tokenId,
        contractAddress: tokenResult.contractAddress,
        transactionHash: tokenResult.transactionHash,
        metadataHash
      }
    } catch (error) {
      console.error('Erro na tokenização:', error)
      throw new Error('Falha na tokenização do perfil')
    }
  }

  /**
   * Simula criação de NFT na blockchain
   */
  private async mintProfileNFT(
    metadataHash: string, 
    metadata: UserTokenMetadata
  ): Promise<Omit<TokenizationResult, 'metadataHash'>> {
    // Simula delay da transação blockchain
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simula dados de resposta da blockchain
    return {
      tokenId: `bzr_profile_${nanoid()}`,
      contractAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      transactionHash: `0x${nanoid(64)}`
    }
  }

  /**
   * Atualiza metadata do token
   */
  async updateTokenMetadata(
    tokenId: string,
    newMetadata: UserTokenMetadata
  ): Promise<boolean> {
    try {
      // Upload nova metadata
      const metadataHash = await ipfsService.uploadProfileMetadata(newMetadata)

      // Simula atualização na blockchain
      await new Promise(resolve => setTimeout(resolve, 1000))

      return true
    } catch (error) {
      console.error('Erro na atualização de metadata:', error)
      throw new Error('Falha na atualização da metadata do token')
    }
  }

  /**
   * Obtém valor de mercado estimado do token
   */
  async getTokenMarketValue(tokenId: string): Promise<number> {
    try {
      // Simula cálculo de valor de mercado
      // Em produção, usar dados de transações reais
      const baseValue = 100 // BZR
      const randomMultiplier = 0.5 + Math.random() * 2 // 0.5x - 2.5x
      
      return Math.round(baseValue * randomMultiplier * 100) / 100
    } catch (error) {
      console.error('Erro ao obter valor de mercado:', error)
      return 0
    }
  }

  /**
   * Verifica se perfil pode ser tokenizado
   */
  canTokenizeProfile(profileData: {
    name: string
    bio?: string
    avatar?: string
    reputation: { overall: number }
  }): { canTokenize: boolean; reason?: string } {
    if (!profileData.name || profileData.name.length < 3) {
      return {
        canTokenize: false,
        reason: 'Nome do perfil deve ter pelo menos 3 caracteres'
      }
    }

    if (!profileData.bio || profileData.bio.length < 20) {
      return {
        canTokenize: false,
        reason: 'Bio deve ter pelo menos 20 caracteres'
      }
    }

    if (!profileData.avatar) {
      return {
        canTokenize: false,
        reason: 'Avatar é obrigatório para tokenização'
      }
    }

    if (profileData.reputation.overall < 50) {
      return {
        canTokenize: false,
        reason: 'Reputação mínima de 50 pontos necessária'
      }
    }

    return { canTokenize: true }
  }

  /**
   * Gera metadata padrão para tokenização
   */
  generateDefaultTokenMetadata(profile: {
    name: string
    bio: string
    avatar: string
    reputation: { overall: number }
    stats: {
      totalEarnings: number
      followersCount: number
      postsCount: number
    }
  }): UserTokenMetadata {
    return {
      name: `${profile.name} - Perfil Bazari`,
      description: profile.bio,
      image: profile.avatar,
      external_url: `https://bazari.app/profile/${profile.name}`,
      attributes: [
        {
          trait_type: 'Reputação',
          value: profile.reputation.overall,
          display_type: 'number'
        },
        {
          trait_type: 'Seguidores',
          value: profile.stats.followersCount,
          display_type: 'number'
        },
        {
          trait_type: 'Posts',
          value: profile.stats.postsCount,
          display_type: 'number'
        },
        {
          trait_type: 'Ganhos Totais',
          value: `${profile.stats.totalEarnings} BZR`
        },
        {
          trait_type: 'Tipo',
          value: 'Perfil de Usuário'
        },
        {
          trait_type: 'Plataforma',
          value: 'Bazari'
        }
      ],
      createdAt: new Date(),
      lastUpdated: new Date()
    }
  }
}

export const tokenizationService = new TokenizationService()
