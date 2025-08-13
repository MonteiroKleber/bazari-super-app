import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@shared/ui/Card'
import { Icons } from '@shared/ui/Icons'

interface DigitalCategoryCardProps {
  category: {
    id: string
    name: string
    count: number
    icon: string
    description?: string
  }
}

export const DigitalCategoryCard: FC<DigitalCategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/marketplace/digitais/lista?category=${category.id}`}
      className="group"
    >
      <Card className="p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer group-hover:border-primary-300">
        
        {/* Icon */}
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
          {category.icon}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        
        {/* Count */}
        <p className="text-sm text-gray-600 mb-2">
          {category.count} produtos
        </p>
        
        {/* Description */}
        {category.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {category.description}
          </p>
        )}
        
        {/* Arrow */}
        <Icons.ArrowRight className="w-4 h-4 text-gray-400 mx-auto mt-3 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
        
      </Card>
    </Link>
  )
}