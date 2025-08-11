
// BEGIN ETAPA3-AUTH
import type { WalletKeyPair } from '@entities/account'

class WalletService {
  generateSeedPhrase(): string {
    const wordlist = [
      'abandon','ability','able','about','above','absent','absorb','abstract',
      'absurd','abuse','access','accident','account','accuse','achieve','acid',
      'acoustic','acquire','across','act','action','actor','actress','actual',
      'adapt','add','addict','address','adjust','admit','adult','advance',
      'advice','aerobic','affair','afford','afraid','again','against','agent',
      'agree','ahead','aim','air','airport','aisle','alarm','album',
      'alcohol','alert','alien','all','alley','allow','almost','alone',
      'alpha','already','also','alter','always','amateur','amazing','among'
    ]
    const words: string[] = []
    for (let i = 0; i < 12; i++) {
      const idx = Math.floor(Math.random() * wordlist.length)
      words.push(wordlist[idx])
    }
    return words.join(' ')
  }

  async generateKeysFromSeed(seedPhrase: string): Promise<WalletKeyPair> {
    const seedBytes = new TextEncoder().encode(seedPhrase)
    const pkHash = await crypto.subtle.digest('SHA-256', seedBytes)
    const privateKey = Array.from(new Uint8Array(pkHash)).map(b => b.toString(16).padStart(2,'0')).join('')

    const pubHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(privateKey))
    const publicKey = Array.from(new Uint8Array(pubHash)).map(b => b.toString(16).padStart(2,'0')).join('')

    const addrHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(publicKey))
    const address = '5' + Array.from(new Uint8Array(addrHash.slice(0,16))).map(b => b.toString(16).padStart(2,'0')).join('')

    return { privateKey, publicKey, address, seedPhrase }
  }

  validateAddress(address: string): boolean {
    return address.length >= 32 && address.startsWith('5')
  }

  async signTransaction(privateKey: string, transaction: string): Promise<string> {
    const data = new TextEncoder().encode(privateKey + transaction)
    const sigHash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(sigHash)).map(b => b.toString(16).padStart(2,'0')).join('')
  }
}

export const walletService = new WalletService()
// END ETAPA3-AUTH

