import { ipfsClient } from './ipfsClient'

interface ImageUploadOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export class IPFSService {
  /**
   * Otimiza e faz upload de imagem
   */
  async uploadImage(
    file: File, 
    options: ImageUploadOptions = {},
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.8,
      format = 'jpeg'
    } = options

    try {
      // Otimiza imagem antes do upload
      const optimizedFile = await this.optimizeImage(file, {
        maxWidth,
        maxHeight,
        quality,
        format
      })

      // Simula progresso (em produção usar XMLHttpRequest)
      if (onProgress) {
        const progressInterval = setInterval(() => {
          const progress = Math.min(90, Math.random() * 100)
          onProgress({
            loaded: progress,
            total: 100,
            percentage: progress
          })
        }, 100)

        setTimeout(() => clearInterval(progressInterval), 1000)
      }

      const hash = await ipfsClient.uploadFile(optimizedFile, {
        pin: true,
        metadata: {
          name: file.name,
          type: 'image',
          originalSize: file.size,
          optimizedSize: optimizedFile.size,
          uploadedAt: new Date().toISOString()
        }
      })

      if (onProgress) {
        onProgress({ loaded: 100, total: 100, percentage: 100 })
      }

      return hash
    } catch (error) {
      console.error('Erro no upload de imagem:', error)
      throw new Error('Falha no upload da imagem')
    }
  }

  /**
   * Otimiza imagem para upload
   */
  private async optimizeImage(
    file: File, 
    options: Required<ImageUploadOptions>
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calcula dimensões mantendo aspect ratio
        const { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          options.maxWidth,
          options.maxHeight
        )

        canvas.width = width
        canvas.height = height

        // Desenha imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height)

        // Converte para blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File(
                [blob],
                file.name,
                { type: `image/${options.format}` }
              )
              resolve(optimizedFile)
            } else {
              reject(new Error('Falha na otimização da imagem'))
            }
          },
          `image/${options.format}`,
          options.quality
        )
      }

      img.onerror = () => {
        reject(new Error('Falha ao carregar imagem'))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Calcula dimensões mantendo aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight

    let width = originalWidth
    let height = originalHeight

    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio
    }

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    return { width: Math.round(width), height: Math.round(height) }
  }

  /**
   * Upload de metadata de perfil
   */
  async uploadProfileMetadata(metadata: any): Promise<string> {
    try {
      return await ipfsClient.uploadJSON(metadata, {
        pin: true,
        metadata: {
          type: 'profile-metadata',
          version: '1.0',
          uploadedAt: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Erro no upload de metadata:', error)
      throw new Error('Falha no upload dos dados do perfil')
    }
  }

  /**
   * Download de metadata de perfil
   */
  async downloadProfileMetadata(hash: string): Promise<any> {
    try {
      return await ipfsClient.downloadJSON(hash)
    } catch (error) {
      console.error('Erro no download de metadata:', error)
      throw new Error('Falha no download dos dados do perfil')
    }
  }

  /**
   * Valida arquivo de imagem
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Formato de arquivo não suportado. Use JPEG, PNG, WebP ou GIF.'
      }
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Arquivo muito grande. Tamanho máximo: 10MB.'
      }
    }

    return { isValid: true }
  }

  /**
   * Obtém URL otimizada da imagem
   */
  getOptimizedImageURL(hash: string, options?: {
    width?: number
    height?: number
    quality?: number
  }): string {
    const baseURL = ipfsClient.getPublicURL(hash)
    
    if (!options) {
      return baseURL
    }

    // Em produção, usar serviço de otimização como Cloudinary ou ImageKit
    const params = new URLSearchParams()
    if (options.width) params.append('w', options.width.toString())
    if (options.height) params.append('h', options.height.toString())
    if (options.quality) params.append('q', options.quality.toString())

    return params.toString() ? `${baseURL}?${params.toString()}` : baseURL
  }
}

export const ipfsService = new IPFSService()
