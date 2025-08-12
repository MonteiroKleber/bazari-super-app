
// BEGIN ETAPA3-AUTH
export interface Account {
  id: string
  address: string
  publicKey: string
  encryptedPrivateKey: string // Criptografado com senha do usuário
  seedPhraseHash: string // Hash da seed phrase para verificação
  derivationPath: string
  name: string
  isDefault: boolean
  createdAt: Date
  lastAccessAt: Date
}

export interface AuthSession {
  accountId: string
  address: string
  publicKey: string
  isAuthenticated: boolean
  loginTime: Date
  lastActivity: Date
}

export interface WalletKeyPair {
  publicKey: string
  privateKey: string
  address: string
  seedPhrase: string
}

export interface AuthCredentials {
   name?: string
  password: string
  confirmPassword?: string
}

export interface SeedPhraseValidation {
  phrase: string
  positions: number[] // Posições para confirmação (ex: [2, 5, 8])
  userInputs: string[] // Palavras inseridas pelo usuário
}
// END ETAPA3-AUTH

