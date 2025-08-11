import { useState, useEffect } from 'react'
import { i18nService, Language, ModuleName } from './i18n'

/**
 * Hook principal para tradução
 * Suporta módulos específicos e chaves aninhadas
 */
export function useTranslation(defaultModule?: ModuleName) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18nService.getCurrentLanguage())

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setCurrentLanguage(event.detail)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  /**
   * Traduz uma chave específica
   * @param module - Módulo de tradução (opcional se defaultModule foi definido)
   * @param key - Chave da tradução
   * @param nestedKey - Chave aninhada (opcional)
   */
  const translate = (module: ModuleName | string, key?: string, nestedKey?: string): string => {
    // Se apenas um parâmetro foi passado e temos um módulo padrão
    if (defaultModule && !key) {
      return i18nService.translate(defaultModule, module as string)
    }

    // Se dois parâmetros foram passados e temos um módulo padrão
    if (defaultModule && key && !nestedKey) {
      return i18nService.translate(defaultModule, module as string, key)
    }

    // Caso normal com módulo explícito
    if (key) {
      return i18nService.translate(module as ModuleName, key, nestedKey)
    }

    // Fallback
    return module as string
  }

  /**
   * Traduz com variáveis
   */
  const translateWithVars = (
    module: ModuleName | string,
    key?: string | Record<string, string | number>,
    variables?: Record<string, string | number> | string,
    nestedKey?: string
  ): string => {
    // Se apenas um parâmetro foi passado e temos um módulo padrão
    if (defaultModule && typeof key === 'object') {
      return i18nService.translateWithVars(defaultModule, module as string, key)
    }

    // Se dois parâmetros foram passados e temos um módulo padrão
    if (defaultModule && typeof key === 'string' && typeof variables === 'object') {
      return i18nService.translateWithVars(defaultModule, module as string, variables, key)
    }

    // Caso normal com módulo explícito
    if (typeof key === 'string' && typeof variables === 'object') {
      return i18nService.translateWithVars(module as ModuleName, key, variables, nestedKey)
    }

    // Fallback
    return translate(module, key as string, variables as string)
  }

  /**
   * Muda o idioma
   */
  const changeLanguage = (language: Language) => {
    i18nService.setLanguage(language)
  }

  /**
   * Obtém todas as traduções de um módulo
   */
  const getModuleTranslations = (module?: ModuleName): Record<string, string> => {
    const targetModule = module || defaultModule
    if (!targetModule) return {}
    return i18nService.getModuleTranslations(targetModule)
  }

  /**
   * Formata números baseado no idioma atual
   */
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return i18nService.formatNumber(number, options)
  }

  /**
   * Formata datas baseado no idioma atual
   */
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return i18nService.formatDate(date, options)
  }

  /**
   * Formata valores monetários
   */
  const formatCurrency = (amount: number, currency?: string): string => {
    return i18nService.formatCurrency(amount, currency)
  }

  /**
   * Lista idiomas disponíveis
   */
  const availableLanguages = i18nService.getAvailableLanguages()

  return {
    // Estado
    currentLanguage,
    availableLanguages,
    
    // Funções de tradução
    t: translate,
    tVar: translateWithVars,
    translate,
    translateWithVars,
    
    // Funções de controle
    changeLanguage,
    getModuleTranslations,
    
    // Funções de formatação
    formatNumber,
    formatDate,
    formatCurrency,
  }
}

/**
 * Hook especializado para módulos específicos
 * Evita repetir o nome do módulo em cada tradução
 */
export function useModuleTranslation(module: ModuleName) {
  return useTranslation(module)
}

/**
 * Hooks especializados para módulos comuns
 */
export const useCommonTranslation = () => useModuleTranslation('common')
export const useHomeTranslation = () => useModuleTranslation('home')
export const useLanguageTranslation = () => useModuleTranslation('language')
export const useErrorsTranslation = () => useModuleTranslation('errors')
export const useNavigationTranslation = () => useModuleTranslation('navigation')
export const useProfileTranslation = () => useModuleTranslation('profile')


/**
 * Hook para detectar mudanças de idioma
 * Útil para componentes que precisam reagir a mudanças
 */
export function useLanguageDetector() {
  const [language, setLanguage] = useState<Language>(i18nService.getCurrentLanguage())

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setLanguage(event.detail)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  return language
}
