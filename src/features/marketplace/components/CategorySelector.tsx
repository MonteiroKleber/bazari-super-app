import { FC, useState } from 'react'
import { CategoryService, Category } from '../data/categories'
const categoryService = new CategoryService()
import { Select } from '@shared/ui/Select'
import { Badge } from '@shared/ui/Badge'

interface CategorySelectorProps {
  selectedCategory?: string
  onCategoryChange: (categoryId: string | null) => void
  showFullPath?: boolean
  placeholder?: string
}

export const CategorySelector: FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  showFullPath = true,
  placeholder = 'Selecione uma categoria'
}) => {
  const [level1, setLevel1] = useState<string>('')
  const [level2, setLevel2] = useState<string>('')
  const [level3, setLevel3] = useState<string>('')
  const [level4, setLevel4] = useState<string>('')

  // 👇 Antes: CategoryService.getTopLevelCategories()
  const topCategories: Category[] = categoryService.getRootCategories()

  // 👇 Antes: CategoryService.getChildCategories(...)
  const level2Categories = level1 ? categoryService.getChildren(level1) : []
  const level3Categories = level2 ? categoryService.getChildren(level2) : []
  const level4Categories = level3 ? categoryService.getChildren(level3) : []

  const handleLevel1Change = (value: string) => {
    setLevel1(value)
    setLevel2('')
    setLevel3('')
    setLevel4('')
    onCategoryChange(value || null)
  }

  const handleLevel2Change = (value: string) => {
    setLevel2(value)
    setLevel3('')
    setLevel4('')
    onCategoryChange(value || level1)
  }

  const handleLevel3Change = (value: string) => {
    setLevel3(value)
    setLevel4('')
    onCategoryChange(value || level2)
  }

  const handleLevel4Change = (value: string) => {
    setLevel4(value)
    onCategoryChange(value || level3)
  }

  const getSelectedPath = () => {
    if (!selectedCategory) return []
    return categoryService.getCategoryPath(selectedCategory)
  }

  return (
    <div className="space-y-4">
      {/* Seletor de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nível 1 */}
        <Select
          label="Categoria Principal"
          value={level1}
          onChange={(e) => handleLevel1Change(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {topCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </Select>

        {/* Nível 2 */}
        {level2Categories.length > 0 && (
          <Select
            label="Subcategoria"
            value={level2}
            onChange={(e) => handleLevel2Change(e.target.value)}
          >
            <option value="">Selecione uma subcategoria</option>
            {level2Categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </Select>
        )}

        {/* Nível 3 */}
        {level3Categories.length > 0 && (
          <Select
            label="Segmento"
            value={level3}
            onChange={(e) => handleLevel3Change(e.target.value)}
          >
            <option value="">Selecione um segmento</option>
            {level3Categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </Select>
        )}

        {/* Nível 4 */}
        {level4Categories.length > 0 && (
          <Select
            label="Nicho"
            value={level4}
            onChange={(e) => handleLevel4Change(e.target.value)}
          >
            <option value="">Selecione um nicho</option>
            {level4Categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </Select>
        )}
      </div>

      {/* Caminho da Categoria Selecionada */}
      {showFullPath && selectedCategory && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Caminho:</span>
          <div className="flex items-center space-x-1">
            {getSelectedPath().map((category, index) => (
              <div key={category.id} className="flex items-center space-x-1">
                {index > 0 && (
                  <span className="text-gray-400">/</span>
                )}
                <Badge variant="secondary" size="sm">
                  {category.icon} {category.name}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
