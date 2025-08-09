import translations from './translations.json'

export type Language = 'pt' | 'en' | 'es'
export type TranslationKey = string
export type ModuleName = keyof typeof translations

interface TranslationValue {
  pt: string
  en: string
  es: string
}

// Tipo para módulo de traduções
type TranslationModule = Record<string, TranslationValue>

class I18nService {
  private currentLanguage: Language = 'pt'
  private fallbackLanguage: Language = 'en'
  private storageKey = 'bazari_language'

  constructor() {
    this.init()
  }

  private init(): void {
    const savedLanguage = this.getSavedLanguage()
    const detectedLanguage = this.detectDeviceLanguage()
    
    this.currentLanguage = savedLanguage || detectedLanguage || this.fallbackLanguage
    this.saveLanguage(this.currentLanguage)
  }

  private detectDeviceLanguage(): Language | null {
    if (typeof navigator === 'undefined') return null
    
    const browserLanguage = navigator.language || navigator.languages?.[0]
    
    if (!browserLanguage) return null

    const languageMap: Record<string, Language> = {
      'pt': 'pt',
      'pt-BR': 'pt',
      'pt-PT': 'pt',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en',
      'es': 'es',
      'es-ES': 'es',
      'es-MX': 'es',
      'es-AR': 'es',
    }

    if (languageMap[browserLanguage]) {
      return languageMap[browserLanguage]
    }

    const baseLanguage = browserLanguage.split('-')[0]
    return languageMap[baseLanguage] || null
  }

  private getSavedLanguage(): Language | null {
    if (typeof localStorage === 'undefined') return null
    
    try {
      const saved = localStorage.getItem(this.storageKey) as Language
      return this.isValidLanguage(saved) ? saved : null
    } catch {
      return null
    }
  }

  private saveLanguage(language: Language): void {
    if (typeof localStorage === 'undefined') return
    
    try {
      localStorage.setItem(this.storageKey, language)
    } catch (error) {
      console.warn('Não foi possível salvar idioma:', error)
    }
  }

  private isValidLanguage(language: string): language is Language {
    return ['pt', 'en', 'es'].includes(language)
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage
  }

  setLanguage(language: Language): void {
    if (!this.isValidLanguage(language)) {
      console.warn(`Idioma inválido: ${language}`)
      return
    }

    this.currentLanguage = language
    this.saveLanguage(language)
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }))
    }
  }

  translate(module: ModuleName, key: TranslationKey): string {
    try {
      const moduleTranslations = translations[module] as TranslationModule
      if (!moduleTranslations) {
        console.warn(`Módulo não encontrado: ${module}`)
        return key
      }

      const translationValue = moduleTranslations[key]
      if (!translationValue) {
        console.warn(`Chave não encontrada: ${module}.${key}`)
        return key
      }

      const translation = translationValue[this.currentLanguage]
      if (!translation) {
        const fallbackTranslation = translationValue[this.fallbackLanguage]
        if (fallbackTranslation) {
          return fallbackTranslation
        }
        return key
      }

      return translation
    } catch (error) {
      console.error('Erro ao traduzir:', error)
      return key
    }
  }

  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const localeMap: Record<Language, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
    }

    try {
      return new Intl.NumberFormat(localeMap[this.currentLanguage], options).format(number)
    } catch {
      return number.toString()
    }
  }

  formatCurrency(amount: number, currency: string = 'BZR'): string {
    if (currency === 'BZR') {
      const formatted = this.formatNumber(amount, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 6 
      })
      return `${formatted} BZR`
    }

    const localeMap: Record<Language, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
    }

    try {
      return new Intl.NumberFormat(localeMap[this.currentLanguage], {
        style: 'currency',
        currency,
      }).format(amount)
    } catch {
      return `${amount} ${currency}`
    }
  }
}

export const i18nService = new I18nService()

export const t = (module: ModuleName, key: TranslationKey) => 
  i18nService.translate(module, key)

export const getCurrentLanguage = () => i18nService.getCurrentLanguage()
export const setLanguage = (language: Language) => i18nService.setLanguage(language)
