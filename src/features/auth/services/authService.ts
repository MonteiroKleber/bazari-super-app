
// BEGIN ETAPA3-AUTH
import { nanoid } from 'nanoid'
import type { Account, AuthCredentials } from '@entities/account'
import { cryptoService } from './cryptoService'
import { walletService } from './walletService'

class AuthService {
  async createAccount(credentials: AuthCredentials, seedPhrase: string): Promise<Account> {
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Senhas não coincidem')
    }
    if ((credentials.password || '').length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres')
    }

    const walletKeys = await walletService.generateKeysFromSeed(seedPhrase)
    const encryptedPrivateKey = await cryptoService.encrypt(walletKeys.privateKey, credentials.password)
    const seedPhraseHash = await cryptoService.hash(seedPhrase)

    const account: Account = {
      id: nanoid(),
      address: walletKeys.address,
      publicKey: walletKeys.publicKey,
      encryptedPrivateKey,
      seedPhraseHash,
      derivationPath: "//0",
      name: 'Minha Conta',
      isDefault: true,
      createdAt: new Date(),
      lastAccessAt: new Date()
    }
    return account
  }

  async importAccount(seedPhrase: string, password: string, name: string): Promise<Account> {
    if (!this.validateSeedPhrase(seedPhrase)) {
      throw new Error('Seed phrase inválida')
    }
    const walletKeys = await walletService.generateKeysFromSeed(seedPhrase)
    const encryptedPrivateKey = await cryptoService.encrypt(walletKeys.privateKey, password)
    const seedPhraseHash = await cryptoService.hash(seedPhrase)

    return {
      id: nanoid(),
      address: walletKeys.address,
      publicKey: walletKeys.publicKey,
      encryptedPrivateKey,
      seedPhraseHash,
      derivationPath: "//0",
      name,
      isDefault: false,
      createdAt: new Date(),
      lastAccessAt: new Date()
    }
  }

  async validateAccountPassword(account: Account, password: string): Promise<boolean> {
    try {
      await cryptoService.decrypt(account.encryptedPrivateKey, password)
      return true
    } catch {
      return false
    }
  }

  async getDecryptedPrivateKey(account: Account, password: string): Promise<string> {
    return cryptoService.decrypt(account.encryptedPrivateKey, password)
  }

  validateSeedPhrase(seedPhrase: string): boolean {
    const words = seedPhrase.trim().split(/\s+/)
    return words.length === 12 || words.length === 24
  }

  generateSeedPhrase(): string {
    return walletService.generateSeedPhrase()
  }

  async recoverAccount(seedPhrase: string): Promise<{ address: string; publicKey: string }> {
    if (!this.validateSeedPhrase(seedPhrase)) throw new Error('Seed phrase inválida')
    const walletKeys = await walletService.generateKeysFromSeed(seedPhrase)
    return { address: walletKeys.address, publicKey: walletKeys.publicKey }
  }
}

export const authService = new AuthService()
// END ETAPA3-AUTH

