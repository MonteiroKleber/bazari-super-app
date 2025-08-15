// src/features/work/components/ProjectCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../entities/workTypes';
import { PROJECT_STATUS_LABELS } from '../entities/workTypes';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, className = '' }) => {
  const formatBZR = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBudgetRange = () => {
    if (project.budgetMinBZR === project.budgetMaxBZR) {
      return `${formatBZR(project.budgetMinBZR)} BZR`;
    }
    return `${formatBZR(project.budgetMinBZR)} - ${formatBZR(project.budgetMaxBZR)} BZR`;
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_NEGOTIATION':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUBMITTED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      desenvolvimento: 'bg-blue-50 text-blue-700',
      design: 'bg-pink-50 text-pink-700',
      marketing: 'bg-orange-50 text-orange-700',
      redacao: 'bg-green-50 text-green-700',
      consultoria: 'bg-purple-50 text-purple-700',
      traducao: 'bg-indigo-50 text-indigo-700',
      dados: 'bg-cyan-50 text-cyan-700',
      vendas: 'bg-red-50 text-red-700',
      suporte: 'bg-yellow-50 text-yellow-700',
      outros: 'bg-gray-50 text-gray-700'
    };
    return colors[category] || colors.outros;
  };

  const timeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return 'Agora mesmo';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                {PROJECT_STATUS_LABELS[project.status]}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getCategoryColor(project.category)}`}>
                {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {project.description}
        </p>

        {/* Budget */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Orçamento:</span>
            <span className="text-lg font-bold text-green-600">
              {getBudgetRange()}
            </span>
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 4 && (
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-md">
                  +{project.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {project.ownerAddress.slice(0, 2)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {project.ownerAddress.slice(0, 8)}...{project.ownerAddress.slice(-4)}
            </span>
          </div>
          
          <span className="text-xs text-gray-400">
            {timeAgo(project.createdAt)}
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            to={`/work/p/${project.slug}`}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Ver Projeto
          </Link>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';