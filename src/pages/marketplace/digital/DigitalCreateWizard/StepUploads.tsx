import { FC, useRef } from 'react'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'
import { Icons } from '@shared/ui/Icons'

interface StepUploadsProps {
  data: any
  onUpdate: (data: any) => void
}

export const StepUploads: FC<StepUploadsProps> = ({ data, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      onUpdate({ files: Array.from(files) })
    }
  }

  const handleCoverUpload = (files: FileList | null) => {
    if (files && files[0]) {
      onUpdate({ coverImage: files[0] })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        Upload de arquivos e informações básicas
      </h2>

      {/* Informações Básicas */}
      <div className="space-y-4">
        <Input
          label="Título do Produto *"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Ex: Curso Completo de Web3 Development"
        />

        <Textarea
          label="Descrição *"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Descreva seu produto digital..."
          rows={4}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagem de Capa *
        </label>
        <div
          onClick={() => coverInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {data.coverImage ? (
            <div className="space-y-2">
              <Icons.Image className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-sm text-gray-600">{data.coverImage.name}</p>
              <p className="text-xs text-gray-500">Clique para alterar</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Icons.Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">Clique para selecionar uma imagem</p>
              <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
            </div>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleCoverUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Files Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Arquivos do Produto *
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {data.files.length > 0 ? (
            <div className="space-y-2">
              <Icons.FileText className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-sm text-gray-600">
                {data.files.length} arquivo(s) selecionado(s)
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                {data.files.slice(0, 3).map((file: File, index: number) => (
                  <div key={index}>{file.name}</div>
                ))}
                {data.files.length > 3 && (
                  <div>e mais {data.files.length - 3} arquivo(s)...</div>
                )}
              </div>
              <p className="text-xs text-gray-500">Clique para alterar</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Icons.Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">
                Clique para selecionar os arquivos do produto
              </p>
              <p className="text-xs text-gray-500">
                Vídeos, PDFs, arquivos de código, etc.
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  )
}