// src/features/wallet/substrate/config.ts

/**
 * Configuração da BazariChain (Substrate)
 * Endpoints e configurações para integração com a blockchain
 */

// Configurações de ambiente
export const SUBSTRATE_CONFIG = {
  // Endpoint WebSocket para conectar com a BazariChain
  // TODO: Configurar via .env quando for integrar com blockchain real
  WS_ENDPOINT: import.meta.env.VITE_SUBSTRATE_WS || 'ws://localhost:9944',
  
  // ID da chain para validação
  CHAIN_ID: import.meta.env.VITE_BAZARI_CHAIN_ID || 'bazari-local',
  
  // Nome da rede para exibição
  NETWORK_NAME: 'BazariChain (testnet)',
  
  // Timeout para conexões
  CONNECTION_TIMEOUT: 30000,
  
  // Configurações de retry
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
}

// Tipos de accounts Substrate
export const ACCOUNT_TYPES = {
  SR25519: 'sr25519',
  ED25519: 'ed25519',
  ECDSA: 'ecdsa',
} as const

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES]

// Configurações de criptografia
export const CRYPTO_CONFIG = {
  DEFAULT_ACCOUNT_TYPE: ACCOUNT_TYPES.SR25519,
  MNEMONIC_STRENGTH: 128, // 12 palavras
  DERIVATION_PATH: "//hard/soft",
}

// Configurações de tokens
export const TOKEN_CONFIG = {
  // Token nativo da BazariChain
  NATIVE_TOKEN: {
    symbol: 'BZR',
    name: 'Bazari',
    decimals: 12,
    isNative: true,
  },
  
  // Configurações de formato
  DECIMAL_PLACES: 4,
  MIN_BALANCE: '0.0001',
}

// Configurações de staking
export const STAKING_CONFIG = {
  MIN_STAKE_AMOUNT: '10',
  UNBONDING_PERIOD: 28, // dias
  MAX_NOMINATIONS: 16,
}

// Helpers para formatação
export const formatBalance = (amount: string, decimals: number = TOKEN_CONFIG.NATIVE_TOKEN.decimals): string => {
  try {
    const value = parseFloat(amount)
    if (isNaN(value)) return '0.0000'
    
    return value.toFixed(TOKEN_CONFIG.DECIMAL_PLACES)
  } catch (error) {
    console.warn('Error formatting balance:', error)
    return '0.0000'
  }
}

export const formatAddress = (address: string, prefix: number = 4, suffix: number = 4): string => {
  if (!address || address.length < prefix + suffix) return address
  
  return `${address.slice(0, prefix)}...${address.slice(-suffix)}`
}

// Mock de addresses para desenvolvimento
export const MOCK_ADDRESSES = [
  '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // Alice
  '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', // Bob
  '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y', // Charlie
  '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy', // Dave
  '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw', // Eve
]

// Função para gerar address mock
export const generateMockAddress = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789'
  let result = '5' // Prefixo padrão Substrate
  
  for (let i = 0; i < 47; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}