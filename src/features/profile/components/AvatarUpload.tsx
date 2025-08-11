import { FC, useRef, useState } from 'react'
import { useImageUpload } from '../hooks/useImageUpload'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

interface AvatarUploadProps {
  currentAvatar?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onAvatarChange?: (url: string) => void
}

export const AvatarUpload: FC<AvatarUploadProps> = ({
  currentAvatar,
  disabled = false,
  size = 'lg',
  onAvatarChange
}) => {
  const { t } = useProfileTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploading, progress, error, uploadImage, reset } = useImageUpload()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  }

  const handleFileSelect = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    try {
      const url = await uploadImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8
      })

      if (url) {
        onAvatarChange?.(url)
        // Clean up preview URL
        URL.revokeObjectURL(objectUrl)
        setPreviewUrl(null)
      }
    } catch (error) {
      // Revert preview on error
      URL.revokeObjectURL(objectUrl)
      setPreviewUrl(null)
    }

    // Reset input
    e.target.value = ''
  }

  const displayImage = previewUrl || currentAvatar

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg ${
            disabled ? 'cursor-default' : 'cursor-pointer hover:opacity-90 transition-opacity'
          }`}
          onClick={handleFileSelect}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={t('avatar')}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-white text-xs">{Math.round(progress.percentage)}%</span>
            </div>
          </div>
        )}

        {/* Camera Icon */}
        {!disabled && !uploading && (
          <div className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 shadow-lg hover:bg-primary-700 transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      {!disabled && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {currentAvatar ? t('clickToChangeAvatar') : t('clickToUploadAvatar')}
          </p>
          <p className="text-xs text-gray-500">
            {t('avatarRequirements')}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-center">
          <p className="text-sm text-error-600">{error}</p>
          <button
            onClick={reset}
            className="text-xs text-primary-600 hover:text-primary-500 mt-1"
          >
            {t('tryAgain')}
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  )
}
