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
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }))
  }

  /**
   * Traduz uma chave específica
   */
  translate(module: ModuleName, key: TranslationKey): string {
    try {
      const moduleTranslations = translations[module]
      if (!moduleTranslations) {
        console.warn(`Módulo de tradução não encontrado: ${module}`)
        return key
      }

      const translationValue = moduleTranslations[key] as TranslationValue
      if (!translationValue) {
        console.warn(`Chave de tradução não encontrada: ${module}.${key}`)
        return key
      }

      const translation = translationValue[this.currentLanguage]
      if (!translation) {
        // Tenta idioma de fallback
        const fallbackTranslation = translationValue[this.fallbackLanguage]
        if (fallbackTranslation) {
          console.warn(`Tradução não encontrada para ${this.currentLanguage}, usando ${this.fallbackLanguage}`)
          return fallbackTranslation
        }
        
        console.warn(`Tradução não encontrada para: ${module}.${key}`)
        return key
      }

      return translation
    } catch (error) {
      console.error('Erro ao traduzir:', error)
      return key
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
    variables: Record<string, string | number> = {}
  ): string {
    let translation = this.translate(module, key)
    
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
      result[key] = this.translate(module, key)
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

    return new Intl.NumberFormat(localeMap[this.currentLanguage], options).format(number)
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

    return new Intl.DateTimeFormat(localeMap[this.currentLanguage], options).format(date)
  }

  /**
   * Função utilitária para formatação de moeda
   */
  formatCurrency(amount: number, currency: string = 'BZR'): string {
    // Para BZR (token customizado), formatamos manualmente
    if (currency === 'BZR') {
      const formatted = this.formatNumber(amount, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 6 
      })
      return `${formatted} BZR`
    }

    // Para outras moedas, usa Intl.NumberFormat padrão
    const localeMap: Record<Language, string> = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
    }

    return new Intl.NumberFormat(localeMap[this.currentLanguage], {
      style: 'currency',
      currency,
    }).format(amount)
  }
}

// Instância singleton
export const i18nService = new I18nService()

// Hook personalizado para React
export { useTranslation } from './useTranslation'

// Funções utilitárias exportadas
export const t = (module: ModuleName, key: TranslationKey) => 
  i18nService.translate(module, key)

export const tVar = (module: ModuleName, key: TranslationKey, variables?: Record<string, string | number>) => 
  i18nService.translateWithVars(module, key, variables)

export const getCurrentLanguage = () => i18nService.getCurrentLanguage()
export const setLanguage = (language: Language) => i18nService.setLanguage(language)
export const getAvailableLanguages = () => i18nService.getAvailableLanguages()
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => 
  i18nService.formatNumber(number, options)
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => 
  i18nService.formatDate(date, options)
export const formatCurrency = (amount: number, currency?: string) => 
  i18nService.formatCurrency(amount, currency)