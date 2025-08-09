import { useState, useEffect } from 'react'
import { i18nService, Language, ModuleName, TranslationKey } from './i18n'

export function useTranslation(defaultModule?: ModuleName) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    i18nService.getCurrentLanguage()
  )

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setCurrentLanguage(event.detail)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('languageChanged', handleLanguageChange as EventListener)

      return () => {
        window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
      }
    }
  }, [])

  const translate = (
    moduleOrKey: ModuleName | TranslationKey,
    key?: TranslationKey
  ): string => {
    if (defaultModule && typeof key === 'undefined') {
      return i18nService.translate(defaultModule, moduleOrKey as TranslationKey)
    }
    
    if (typeof key === 'string') {
      return i18nService.translate(moduleOrKey as ModuleName, key)
    }

    console.warn('useTranslation: parâmetros inválidos')
    return moduleOrKey as string
  }

  const changeLanguage = (language: Language): void => {
    i18nService.setLanguage(language)
  }

  return {
    currentLanguage,
    t: translate,
    translate,
    changeLanguage,
  }
}

export function useModuleTranslation(module: ModuleName) {
  return useTranslation(module)
}

export const useCommonTranslation = () => useModuleTranslation('common')
export const useAuthTranslation = () => useModuleTranslation('auth')
export const useMarketplaceTranslation = () => useModuleTranslation('marketplace')
export const useWalletTranslation = () => useModuleTranslation('wallet')
