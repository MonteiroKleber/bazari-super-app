// src/features/work/components/ProjectFilters.tsx
import React, { useState, useDeferredValue } from 'react';
import type { WorkFilters, WorkCategory } from '../entities/workTypes';

interface ProjectFiltersProps {
  filters: WorkFilters;
  availableCategories: Array<{ value: WorkCategory; label: string }>;
  availableTags: string[];
  onFiltersChange: (filters: Partial<WorkFilters>) => void;
  onReset: () => void;
  className?: string;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  availableCategories,
  availableTags,
  onFiltersChange,
  onReset,
  className = ''
}) => {
  const [searchInput, setSearchInput] = useState(filters.q || '');
  const [showAllTags, setShowAllTags] = useState(false);
  const deferredSearchInput = useDeferredValue(searchInput);

  // Atualizar busca com debounce via useDeferredValue
  React.useEffect(() => {
    if (deferredSearchInput !== filters.q) {
      onFiltersChange({ q: deferredSearchInput });
    }
  }, [deferredSearchInput, filters.q, onFiltersChange]);

  const handleCategoryChange = (category: string) => {
    const newCategory = category === '' ? undefined : category as WorkCategory;
    onFiltersChange({ category: newCategory });
  };

  const handleSortChange = (sort: string) => {
    onFiltersChange({ sort: sort as WorkFilters['sort'] });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ tags: newTags });
  };

  const hasActiveFilters = filters.q || filters.category || (filters.tags && filters.tags.length > 0);
  const visibleTags = showAllTags ? availableTags : availableTags.slice(0, 8);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Buscar projetos
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Digite palavras-chave..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas as categorias</option>
            {availableCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            id="sort"
            value={filters.sort || 'newest'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Mais recentes</option>
            <option value="budget_desc">Maior orçamento</option>
            <option value="budget_asc">Menor orçamento</option>
          </select>
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags populares
              </label>
              {availableTags.length > 8 && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showAllTags ? 'Ver menos' : `Ver todas (${availableTags.length})`}
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => {
                const isSelected = filters.tags?.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border transition-colors duration-200 ${
                      isSelected
                        ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Selected tags summary */}
            {filters.tags && filters.tags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {filters.tags.length} tag{filters.tags.length > 1 ? 's' : ''} selecionada{filters.tags.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => onFiltersChange({ tags: [] })}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Limpar tags
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpar filtros
            </button>
          )}
          
          <div className="flex-1 text-sm text-gray-500 flex items-center">
            {filters.tags && filters.tags.length > 0 && (
              <span>
                Filtrando por: {filters.tags.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};