import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, i18nService } from './i18n'

interface LanguageContextType {
  currentLanguage: Language
  changeLanguage: (language: Language) => void
  availableLanguages: Array<{ code: Language; name: string; nativeName: string }>
  isLanguageSelected: boolean
  setLanguageSelected: (selected: boolean) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18nService.getCurrentLanguage())
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false)
  
  const availableLanguages = i18nService.getAvailableLanguages()

  useEffect(() => {
    // Verifica se o usuário já selecionou um idioma anteriormente
    const hasSelectedLanguage = localStorage.getItem('bazari_language_selected') === 'true'
    setIsLanguageSelected(hasSelectedLanguage)

    // Escuta mudanças de idioma
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setCurrentLanguage(event.detail)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  const changeLanguage = (language: Language) => {
    i18nService.setLanguage(language)
    setCurrentLanguage(language)
    
    // Marca que o usuário já fez uma seleção de idioma
    if (!isLanguageSelected) {
      setLanguageSelected(true)
    }
  }

  const setLanguageSelected = (selected: boolean) => {
    setIsLanguageSelected(selected)
    localStorage.setItem('bazari_language_selected', selected.toString())
  }

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    isLanguageSelected,
    setLanguageSelected,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}
