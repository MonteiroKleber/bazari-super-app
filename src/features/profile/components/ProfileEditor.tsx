import { FC, useState, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useImageUpload } from '../hooks/useImageUpload'
import { AvatarUpload } from './AvatarUpload'
import { useProfileTranslation } from '@shared/hooks/useTranslation'

interface ProfileEditorProps {
  onSave?: () => void
  onCancel?: () => void
}

export const ProfileEditor: FC<ProfileEditorProps> = ({ onSave, onCancel }) => {
  const { t } = useProfileTranslation()
  const {
    profile,
    isEditing,
    editingData,
    hasUnsavedChanges,
    saveEditing,
    cancelEditing,
    updateEditingData,
    startEditing,
    isLoading,
    error
  } = useProfile()

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    website: ''
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || ''
      })
    }
  }, [profile, isEditing])

  useEffect(() => {
    if (editingData) {
      setFormData({
        name: editingData.name || '',
        bio: editingData.bio || '',
        email: editingData.email || '',
        phone: editingData.phone || '',
        location: editingData.location || '',
        website: editingData.website || ''
      })
    }
  }, [editingData])

  const handleStartEditing = () => {
    startEditing(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    updateEditingData({ [field]: value })
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = t('nameRequired')
    } else if (formData.name.length < 2) {
      errors.name = t('nameMinLength')
    } else if (formData.name.length > 50) {
      errors.name = t('nameMaxLength')
    }

    if (formData.bio && formData.bio.length > 500) {
      errors.bio = t('bioMaxLength')
    }

    if (formData.email && !isValidEmail(formData.email)) {
      errors.email = t('invalidEmail')
    }

    if (formData.website && !isValidURL(formData.website)) {
      errors.website = t('invalidWebsite')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    const success = await saveEditing()
    if (success) {
      onSave?.()
    }
  }

  const handleCancel = () => {
    cancelEditing()
    setFormErrors({})
    onCancel?.()
  }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  if (!profile) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? t('editProfile') : t('profile')}
        </h2>
        
        {!isEditing && (
          <button
            onClick={handleStartEditing}
            className="btn-primary"
          >
            {t('editProfile')}
          </button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex justify-center">
        <AvatarUpload
          currentAvatar={profile.avatar}
          disabled={!isEditing}
          onAvatarChange={(url) => updateEditingData({ avatar: url })}
        />
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('name')} *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            className="w-full input-bazari"
            placeholder={t('enterYourName')}
            maxLength={50}
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-error-600">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('bio')}
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            className="w-full input-bazari h-24 resize-none"
            placeholder={t('tellAboutYourself')}
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            {formErrors.bio && (
              <p className="text-sm text-error-600">{formErrors.bio}</p>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              {formData.bio.length}/500
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className="w-full input-bazari"
              placeholder={t('yourEmail')}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-error-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('phone')}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className="w-full input-bazari"
              placeholder={t('yourPhone')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('location')}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              className="w-full input-bazari"
              placeholder={t('yourLocation')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('website')}
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              disabled={!isEditing}
              className="w-full input-bazari"
              placeholder="https://..."
            />
            {formErrors.website && (
              <p className="mt-1 text-sm text-error-600">{formErrors.website}</p>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-3">
          <p className="text-error-700 text-sm">{error}</p>
        </div>
      )}

      {/* Actions */}
      {isEditing && (
        <div className="flex space-x-4 pt-4">
          <button
            onClick={handleCancel}
            className="flex-1 btn-secondary"
            disabled={isLoading}
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {isLoading ? t('saving') : t('saveChanges')}
          </button>
        </div>
      )}
    </div>
  )
}
