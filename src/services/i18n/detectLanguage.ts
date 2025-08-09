import type { Language } from '@app/i18n/i18n'

export const detectLanguage = (): Language => {
  try {
    const browserLanguages = navigator.languages || [navigator.language]
    
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
    }

    for (const browserLang of browserLanguages) {
      const exactMatch = languageMap[browserLang]
      if (exactMatch) {
        return exactMatch
      }
    }

    for (const browserLang of browserLanguages) {
      //const baseLanguage = browserLang.split('-')[0]
      //const baseMatch = languageMap[baseLanguage]
      //if (baseMatch) {
        //return baseMatch
      //}
    }

    return 'en'
  } catch {
    return 'en'
  }
}

export const isSupportedLanguage = (language: string): language is Language => {
  const supportedLanguages: Language[] = ['pt', 'en', 'es']
  return supportedLanguages.includes(language as Language)
}
