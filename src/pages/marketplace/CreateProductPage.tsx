import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBusiness } from '@features/marketplace/hooks/useBusiness'
import { CategorySelector } from '@features/marketplace/components/CategorySelector'
import { Product, ProductImage } from '@entities/product'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'
import { Select } from '@shared/ui/Select'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { Icons } from '@shared/ui/Icons'

export const CreateProductPage: FC = () => {
  const { businessId } = useParams<{ businessId: string }>()
  const navigate = useNavigate()
  const { createProduct, isLoading, error } = useBusiness()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    currency: 'BZR',
    category: '',
    tags: '',
    stock: '',
    sku: '',
    weight: '',
    isDigital: false,
    isUnlimited: false,
    trackInventory: true,
    isTokenized: false,
    isNFT: false
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate images
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert('Apenas imagens são permitidas')
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande (máximo 5MB)')
        return false
      }
      return true
    })

    setImages(prev => [...prev, ...validFiles])

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessId) {
      alert('ID do negócio não encontrado')
      return
    }

    try {
      // TODO: Upload images to IPFS first
      const productImages: ProductImage[] = imagePreviews.map((url, index) => ({
        id: `img_${index}`,
        url,
        cid: '', // Will be set after IPFS upload
        alt: formData.name,
        isMain: index === 0,
        order: index
      }))

      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'> = {
        businessId,
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        currency: formData.currency as 'BZR' | 'USD' | 'BRL',
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        images: productImages,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku,
        isUnlimited: formData.isUnlimited,
        trackInventory: formData.trackInventory && !formData.isUnlimited,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        isTokenized: formData.isTokenized,
        isNFT: formData.isNFT,
        isActive: true,
        isFeatured: false,
        isDigital: formData.isDigital,
        rating: 0,
        reviewCount: 0,
        totalSales: 0,
        views: 0
      }

      const product = await createProduct(productData)
      if (product) {
        navigate(`/marketplace/product/${product.id}`)
      }
    } catch (err) {
      console.error('Erro ao criar produto:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📦 Cadastrar Produto
          </h1>
          <p className="text-gray-600">
            Adicione um novo produto ao seu negócio
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
                  
                  <div className="space-y-4">
                    <Input
                      label="Nome do Produto *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Camiseta Personalizada"
                      required
                    />

                    <Textarea
                      label="Descrição Curta"
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      placeholder="Breve descrição que aparece nos cards..."
                      rows={2}
                    />

                    <Textarea
                      label="Descrição Completa *"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descrição detalhada do produto..."
                      rows={4}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                      </label>
                      <CategorySelector
                        selectedCategory={formData.category}
                        onCategoryChange={(category) => handleInputChange('category', category || '')}
                        showFullPath
                      />
                    </div>

                    <Input
                      label="Tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="Ex: algodão, personalizado, unissex (separadas por vírgula)"
                    />
                  </div>
                </div>
              </Card>

              {/* Pricing */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Preço</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Preço *"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                    
                    <Input
                      label="Preço Original"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      placeholder="0.00"
                      helperText="Para mostrar desconto"
                    />
                    
                    <Select
                      label="Moeda *"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="BZR">BZR (Bazari)</option>
                      <option value="USD">USD (Dólar)</option>
                      <option value="BRL">BRL (Real)</option>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Inventory */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Estoque</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isUnlimited}
                        onChange={(e) => handleInputChange('isUnlimited', e.target.checked)}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">
                        Estoque ilimitado
                      </label>
                    </div>

                    {!formData.isUnlimited && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Quantidade em Estoque"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          placeholder="0"
                        />
                        
                        <Input
                          label="SKU"
                          value={formData.sku}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          placeholder="Ex: CAM-001"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.trackInventory}
                        onChange={(e) => handleInputChange('trackInventory', e.target.checked)}
                        disabled={formData.isUnlimited}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">
                        Controlar estoque
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Images */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Imagens</h2>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Icons.Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Clique para adicionar imagens ou arraste aqui
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG até 5MB cada
                        </p>
                      </label>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                            {index === 0 && (
                              <Badge className="absolute bottom-1 left-1" size="sm">
                                Principal
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Type */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tipo de Produto</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isDigital}
                        onChange={(e) => handleInputChange('isDigital', e.target.checked)}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">
                        Produto Digital
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isTokenized}
                        onChange={(e) => handleInputChange('isTokenized', e.target.checked)}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">
                        Produto Tokenizado
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isNFT}
                        onChange={(e) => handleInputChange('isNFT', e.target.checked)}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">
                        NFT Exclusivo
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Shipping */}
              {!formData.isDigital && (
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Envio</h3>
                    
                    <Input
                      label="Peso (kg)"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <div className="p-6">
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      loading={isLoading}
                      className="w-full"
                    >
                      Criar Produto
                    </Button>
                    
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate(-1)}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>

                  {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
