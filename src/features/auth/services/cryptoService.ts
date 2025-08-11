
// BEGIN ETAPA3-AUTH
class CryptoService {
  async encrypt(data: string, password: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const key = await this.deriveKey(password, salt)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    )

    const result = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength)
    result.set(salt, 0)
    result.set(iv, salt.length)
    result.set(new Uint8Array(encryptedBuffer), salt.length + iv.length)

    return btoa(String.fromCharCode(...result))
  }

  async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)))
      const salt = data.slice(0, 16)
      const iv = data.slice(16, 28)
      const encrypted = data.slice(28)
      const key = await this.deriveKey(password, salt)
      const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
      const decoder = new TextDecoder()
      return decoder.decode(decryptedBuffer)
    } catch {
      throw new Error('Falha na descriptografia - senha incorreta?')
    }
  }

  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    const baseKey = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey'])
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  async hash(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = new Uint8Array(hashBuffer)
    return btoa(String.fromCharCode(...hashArray))
  }

  generateRandomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length))
  }
}

export const cryptoService = new CryptoService()
// END ETAPA3-AUTH

