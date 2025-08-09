interface StorageOptions {
  encrypt?: boolean
  expirationTime?: number
}

interface StorageItem<T> {
  value: T
  timestamp: number
  expiresAt?: number
}

class SecureStorage {
  private prefix = 'bazari_'

  setItem<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiresAt: options.expirationTime ? Date.now() + options.expirationTime : undefined,
      }

      let serializedItem = JSON.stringify(item)

      if (options.encrypt) {
        serializedItem = btoa(serializedItem)
      }

      localStorage.setItem(this.prefix + key, serializedItem)
      return true
    } catch (error) {
      console.warn(`Erro ao salvar item ${key}:`, error)
      return false
    }
  }

  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const stored = localStorage.getItem(this.prefix + key)
      if (!stored) {
        return defaultValue ?? null
      }

      let serializedItem = stored
      try {
        if (/^[A-Za-z0-9+/]*={0,2}$/.test(stored)) {
          serializedItem = atob(stored)
        }
      } catch {
        // Se falhar na descriptografia, usa o valor original
      }

      const item: StorageItem<T> = JSON.parse(serializedItem)

      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.removeItem(key)
        return defaultValue ?? null
      }

      return item.value
    } catch (error) {
      console.warn(`Erro ao recuperar item ${key}:`, error)
      return defaultValue ?? null
    }
  }

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.prefix + key)
      return true
    } catch (error) {
      console.warn(`Erro ao remover item ${key}:`, error)
      return false
    }
  }

  clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.warn('Erro ao limpar storage:', error)
      return false
    }
  }
}

export const secureStorage = new SecureStorage()
