import translations from './translations.json'

// Tipos para o sistema de i18n
export type Language = 'pt' | 'en' | 'es'
export type TranslationKey = string
export type ModuleName = keyof typeof translations

interface TranslationValue {
  pt: string
  en: string
  es: string
}

// Classe principal do sistema de i18n
class I18nService {
  private currentLanguage: Language = 'pt'
  private fallbackLanguage: Language = 'en'
  private storageKey = 'bazari_language'

  constructor() {
    this.init()
  }

  /**
   * Inicializa o sistema de i18n
   * Detecta idioma salvo ou do dispositivo
   */
  private init(): void {
    const savedLanguage = this.getSavedLanguage()
    const detectedLanguage = this.detectDeviceLanguage()
    
    this.currentLanguage = savedLanguage || detectedLanguage || this.fallbackLanguage
    this.saveLanguage(this.currentLanguage)
  }

  /**
   * Detecta idioma do dispositivo
   */
  private detectDeviceLanguage(): Language | null {
    if (typeof navigator === 'undefined') return null
    
    const browserLanguage = navigator.language || navigator.languages?.[0]
    
    if (!browserLanguage) return null

    // Mapeia códigos de idioma para nossas opções suportadas
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

    // Tenta corresponder idioma exato
    if (languageMap[browserLanguage]) {
      return languageMap[browserLanguage]
    }

    // Tenta corresponder apenas o código base (ex: 'pt' de 'pt-BR')
    const baseLanguage = browserLanguage.split('-')[0]
    return languageMap[baseLanguage] || null
  }

  /**
   * Obtém idioma salvo no localStorage
   */
  private getSavedLanguage(): Language | null {
    if (typeof localStorage === 'undefined') return null
    
    try {
      const saved = localStorage.getItem(this.storageKey) as Language
      return this.isValidLanguage(saved) ? saved : null
    } catch {
      return null
    }
  }

  /**
   * Salva idioma no localStorage
   */
  private saveLanguage(language: Language): void {
    if (typeof localStorage === 'undefined') return
    
    try {
      localStorage.setItem(this.storageKey, language)
    } catch (error) {
      console.warn('Não foi possível salvar idioma no localStorage:', error)
    }
  }

  /**
   * Verifica se o idioma é válido
   */
  private isValidLanguage(language: string): language is Language {
    return ['pt', 'en', 'es'].includes(language)
  }

  /**
   * Obtém idioma atual
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage
  }

  /**
   * Define novo idioma
   */
  setLanguage(language: Language): void {
    if (!this.isValidLanguage(language)) {
      console.warn(`Idioma inválido: ${language}`)
      return
    }

    this.currentLanguage = language
    this.saveLanguage(language)
    
    // Dispara evento personalizado para componentes React
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }))
    }
  }

  /**
   * Traduz uma chave específica com suporte a chaves aninhadas
   */
  translate(module: ModuleName, key: TranslationKey, nestedKey?: string): string {
    try {
      const moduleTranslations = translations[module]
      if (!moduleTranslations) {
        console.warn(`Módulo de tradução não encontrado: ${module}`)
        return nestedKey || key
      }

      let translationValue: any = moduleTranslations[key]
      
      // Se há uma chave aninhada, navega mais profundo
      if (nestedKey && translationValue && typeof translationValue === 'object') {
        translationValue = translationValue[nestedKey]
      }

      if (!translationValue || typeof translationValue !== 'object') {
        console.warn(`Chave de tradução não encontrada: ${module}.${key}${nestedKey ? '.' + nestedKey : ''}`)
        return nestedKey || key
      }

      const translation = translationValue[this.currentLanguage]
      if (!translation) {
        // Tenta idioma de fallback
        const fallbackTranslation = translationValue[this.fallbackLanguage]
        if (fallbackTranslation) {
          console.warn(`Tradução não encontrada para ${this.currentLanguage}, usando ${this.fallbackLanguage}`)
          return fallbackTranslation
        }
        
        console.warn(`Tradução não encontrada para: ${module}.${key}${nestedKey ? '.' + nestedKey : ''}`)
        return nestedKey || key
      }

      return translation
    } catch (error) {
      console.error('Erro ao traduzir:', error)
      return nestedKey || key
    }
  }

  /**
   * Traduz com interpolação de variáveis
   * Exemplo: t('common', 'welcome', { name: 'João' })
   * String: "Bem-vindo, {{name}}!"
   */
  translateWithVars(
    module: ModuleName, 
    key: TranslationKey, 
    variables: Record<string, string | number> = {},
    nestedKey?: string
  ): string {
    let translation = this.translate(module, key, nestedKey)
    
    // Substitui variáveis no formato {{variableName}}
    Object.entries(variables).forEach(([varName, value]) => {
      const regex = new RegExp(`{{\\s*${varName}\\s*}}`, 'g')
      translation = translation.replace(regex, String(value))
    })
    
    return translation
  }

  /**
   * Retorna todas as traduções de um módulo no idioma atual
   */
  getModuleTranslations(module: ModuleName): Record<string, string> {
    const moduleTranslations = translations[module]
    if (!moduleTranslations) return {}

    const result: Record<string, string> = {}
    
    Object.entries(moduleTranslations).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const translation = (value as TranslationValue)[this.currentLanguage]
        if (translation) {
          result[key] = translation
        }
      }
    })

    return result
  }

  /**
   * Lista idiomas disponíveis com nomes nativos
   */
  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
    ]
  }

  /**
   * Função utilitária para formatação de números baseada no idioma
   */
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

  /**
   * Função utilitária para formatação de datas baseada no idioma
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const localeMap: Record<Language, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
    }

    try {
      return new Intl.DateTimeFormat(localeMap[this.currentLanguage], options).format(date)
    } catch {
      return date.toLocaleDateString()
    }
  }

  /**
   * Função utilitária para formatação de moeda
   */
  formatCurrency(amount: number, currency?: string): string {
    const currencyMap: Record<Language, string> = {
      'pt': 'BRL',
      'en': 'USD',
      'es': 'EUR',
    }

    const localeMap: Record<Language, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
    }

    const targetCurrency = currency || currencyMap[this.currentLanguage]

    try {
      if (targetCurrency === 'BZR') {
        const formatted = this.formatNumber(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
        return `${formatted} BZR`
      }

      return new Intl.NumberFormat(localeMap[this.currentLanguage], {
        style: 'currency',
        currency: targetCurrency,
      }).format(amount)
    } catch {
      return `${amount} ${targetCurrency}`
    }
  }
}

// Instância singleton do serviço
export const i18nService = new I18nService()
