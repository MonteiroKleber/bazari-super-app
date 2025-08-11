interface IPFSConfig {
  gateway: string
  apiEndpoint: string
  projectId?: string
  projectSecret?: string
  pinataJWT?: string
}

export class IPFSClient {
  private config: IPFSConfig
  
  constructor(config: IPFSConfig) {
    this.config = config
  }

  /**
   * Faz upload de arquivo para IPFS
   */
  async uploadFile(file: File, options?: { pin?: boolean; metadata?: any }): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (options?.metadata) {
        formData.append('pinataMetadata', JSON.stringify(options.metadata))
      }

      const response = await fetch(`${this.config.apiEndpoint}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.pinataJWT}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload falhou: ${response.statusText}`)
      }

      const result = await response.json()
      return result.IpfsHash
    } catch (error) {
      console.error('Erro no upload IPFS:', error)
      throw new Error('Falha no upload do arquivo')
    }
  }

  /**
   * Faz upload de dados JSON para IPFS
   */
  async uploadJSON(data: any, options?: { pin?: boolean; metadata?: any }): Promise<string> {
    try {
      const jsonString = JSON.stringify(data)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const file = new File([blob], 'data.json', { type: 'application/json' })
      
      return this.uploadFile(file, options)
    } catch (error) {
      console.error('Erro no upload JSON IPFS:', error)
      throw new Error('Falha no upload dos dados')
    }
  }

  /**
   * Baixa arquivo do IPFS
   */
  async downloadFile(hash: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.config.gateway}/ipfs/${hash}`)
      
      if (!response.ok) {
        throw new Error(`Download falhou: ${response.statusText}`)
      }

      return response.blob()
    } catch (error) {
      console.error('Erro no download IPFS:', error)
      throw new Error('Falha no download do arquivo')
    }
  }

  /**
   * Baixa dados JSON do IPFS
   */
  async downloadJSON(hash: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.gateway}/ipfs/${hash}`)
      
      if (!response.ok) {
        throw new Error(`Download falhou: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Erro no download JSON IPFS:', error)
      throw new Error('Falha no download dos dados')
    }
  }

  /**
   * Obtém URL público do arquivo
   */
  getPublicURL(hash: string): string {
    return `${this.config.gateway}/ipfs/${hash}`
  }

  /**
   * Pin arquivo existente
   */
  async pinFile(hash: string, metadata?: any): Promise<void> {
    try {
      const body: any = { hashToPin: hash }
      
      if (metadata) {
        body.pinataMetadata = metadata
      }

      const response = await fetch(`${this.config.apiEndpoint}/pinning/pinByHash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.pinataJWT}`
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`Pin falhou: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erro no pin IPFS:', error)
      throw new Error('Falha ao fixar arquivo')
    }
  }

  /**
   * Remove pin do arquivo
   */
  async unpinFile(hash: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/pinning/unpin/${hash}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.pinataJWT}`
        }
      })

      if (!response.ok) {
        throw new Error(`Unpin falhou: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erro no unpin IPFS:', error)
      throw new Error('Falha ao remover fixação')
    }
  }
}

// Instância padrão do cliente IPFS
export const ipfsClient = new IPFSClient({
  gateway: import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud',
  apiEndpoint: 'https://api.pinata.cloud',
  pinataJWT: import.meta.env.VITE_IPFS_JWT_TOKEN
})
