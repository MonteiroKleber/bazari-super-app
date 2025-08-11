import { useState, useCallback } from 'react'
import { ipfsService } from '@services/ipfs/ipfsService'

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress>({ loaded: 0, total: 100, percentage: 0 })
  const [error, setError] = useState<string | null>(null)
  const [uploadedURL, setUploadedURL] = useState<string | null>(null)

  const uploadImage = useCallback(async (
    file: File,
    options?: {
      maxWidth?: number
      maxHeight?: number
      quality?: number
    }
  ) => {
    // Valida arquivo
    const validation = ipfsService.validateImageFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'Arquivo inválido')
      return null
    }

    setUploading(true)
    setError(null)
    setProgress({ loaded: 0, total: 100, percentage: 0 })

    try {
      const hash = await ipfsService.uploadImage(
        file,
        options,
        (uploadProgress) => {
          setProgress(uploadProgress)
        }
      )

      const url = ipfsService.getOptimizedImageURL(hash)
      setUploadedURL(url)
      
      return url
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload'
      setError(errorMessage)
      return null
    } finally {
      setUploading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setUploading(false)
    setProgress({ loaded: 0, total: 100, percentage: 0 })
    setError(null)
    setUploadedURL(null)
  }, [])

  return {
    uploading,
    progress,
    error,
    uploadedURL,
    uploadImage,
    reset,
    hasUploadedImage: !!uploadedURL
  }
}
