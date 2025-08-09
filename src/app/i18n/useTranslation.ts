import { useState, useEffect } from 'react'
import { i18nService, Language, ModuleName, TranslationKey } from './i18n'

/**
 * Hook React para sistema de tradução
 * Atualiza automaticamente quando o idioma muda
 */
export function useTranslation(defaultModule?: ModuleName) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    i18nService.getCurrentLanguage()
  )

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setCurrentLanguage(event.detail)
    }

    // Escuta mudanças de idioma
    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  /**
   * Função de tradução principal
   * Se defaultModule estiver definido, pode ser chamada apenas com a chave
   */
  const translate = (
    moduleOrKey: ModuleName | TranslationKey,
    key?: TranslationKey
  ): string => {
    if (defaultModule && typeof key === 'undefined') {
      // Caso: t('loading') com defaultModule definido
      return i18nService.translate(defaultModule, moduleOrKey as TranslationKey)
    }
    
    if (typeof key === 'string') {
      // Caso: t('common', 'loading')
      return i18nService.translate(moduleOrKey as ModuleName, key)
    }

    console.warn('useTranslation: parâmetros inválidos')
    return moduleOrKey as string
  }

  /**
   * Função de tradução com variáveis
   */
  const translateWithVars = (
    moduleOrKey: ModuleName | TranslationKey,
    keyOrVars?: TranslationKey | Record<string, string | number>,
    variables?: Record<string, string | number>
  ): string => {
    if (defaultModule && typeof keyOrVars === 'object') {
      // Caso: tVar('welcome', { name: 'João' }) com defaultModule
      return i18nService.translateWithVars(
        defaultModule, 
        moduleOrKey as TranslationKey, 
        keyOrVars
      )
    }
    
    if (typeof keyOrVars === 'string' && variables) {
      // Caso: tVar('common', 'welcome', { name: 'João' })
      return i18nService.translateWithVars(
        moduleOrKey as ModuleName, 
        keyOrVars, 
        variables
      )
    }

    console.warn('useTranslation: parâmetros inválidos para translateWithVars')
    return moduleOrKey as string
  }

  /**
   * Muda o idioma da aplicação
   */
  const changeLanguage = (language: Language): void => {
    i18nService.setLanguage(language)
  }

  /**
   * Obtém traduções de um módulo inteiro
   */
  const getModuleTranslations = (module: ModuleName): Record<string, string> => {
    return i18nService.getModuleTranslations(module)
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
export const useAuthTranslation = () => useModuleTranslation('auth')
export const useProfileTranslation = () => useModuleTranslation('profile')
export const useMarketplaceTranslation = () => useModuleTranslation('marketplace')
export const useBusinessTranslation = () => useModuleTranslation('business')
export const useWalletTranslation = () => useModuleTranslation('wallet')
export const useSocialTranslation = () => useModuleTranslation('social')
export const useDaoTranslation = () => useModuleTranslation('dao')
export const useDexTranslation = () => useModuleTranslation('dex')
export const useWorkTranslation = () => useModuleTranslation('work')
export const useSettingsTranslation = () => useModuleTranslation('settings')
export const useErrorsTranslation = () => useModuleTranslation('errors')

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