export * from '@app/i18n/useTranslation'

// wrappers convenientes por módulo
import { useModuleTranslation } from '@app/i18n/useTranslation'

export const useAuthTranslation = () => useModuleTranslation('auth')
export const useProfileTranslation = () => useModuleTranslation('profile')
export const useCommonTranslation = () => useModuleTranslation('common')