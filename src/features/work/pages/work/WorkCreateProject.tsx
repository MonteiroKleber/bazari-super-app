// src/features/work/pages/work/WorkCreateProject.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWork } from '../../hooks/useWork';
import type { WorkCategory, Milestone } from '../../entities/workTypes';
import { WORK_CATEGORIES } from '../../entities/workTypes';

interface FormData {
  title: string;
  description: string;
  category: WorkCategory | '';
  budgetMinBZR: string;
  budgetMaxBZR: string;
  tags: string[];
  milestones: Milestone[];
}

export const WorkCreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useWork();
  
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    budgetMinBZR: '',
    budgetMaxBZR: '',
    tags: [],
    milestones: []
  });

  // Mock current user (TODO: Replace with actual auth context)
  const currentUserAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

  const [tagInput, setTagInput] = useState('');
  const [newMilestone, setNewMilestone] = useState({ title: '', amountBZR: '' });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      updateFormData({ tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData({ tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const addMilestone = () => {
    const title = newMilestone.title.trim();
    const amount = parseFloat(newMilestone.amountBZR);
    
    if (title && amount > 0) {
      const milestone: Milestone = {
        id: `milestone-${Date.now()}`,
        title,
        amountBZR: amount,
        done: false
      };
      
      updateFormData({ milestones: [...formData.milestones, milestone] });
      setNewMilestone({ title: '', amountBZR: '' });
    }
  };

  const removeMilestone = (milestoneId: string) => {
    updateFormData({ 
      milestones: formData.milestones.filter(m => m.id !== milestoneId) 
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove multiple hyphens
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return formData.title.trim().length >= 10 && 
               formData.description.trim().length >= 50;
      case 2:
        const minBudget = parseFloat(formData.budgetMinBZR);
        const maxBudget = parseFloat(formData.budgetMaxBZR);
        return minBudget > 0 && maxBudget >= minBudget && formData.category !== '';
      case 3:
        return formData.tags.length >= 2;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    
    try {
      const project = await createProject({
        title: formData.title.trim(),
        slug: generateSlug(formData.title),
        description: formData.description.trim(),
        category: formData.category as WorkCategory,
        budgetMinBZR: parseFloat(formData.budgetMinBZR),
        budgetMaxBZR: parseFloat(formData.budgetMaxBZR),
        currency: 'BZR',
        tags: formData.tags,
        ownerAddress: currentUserAddress,
        status: 'OPEN'
      });

      navigate(`/work/p/${project.slug}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Erro ao criar projeto. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalMilestoneAmount = formData.milestones.reduce((sum, m) => sum + m.amountBZR, 0);
  const budgetMin = parseFloat(formData.budgetMinBZR) || 0;
  const budgetMax = parseFloat(formData.budgetMaxBZR) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/work')}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Publicar Novo Projeto
              </h1>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNumber === step
                      ? 'bg-blue-600 text-white'
                      : stepNumber < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber < step ? '✓' : stepNumber}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-8">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Informações Básicas
                  </h2>
                  <p className="text-gray-600">
                    Descreva claramente o que você precisa para atrair os melhores freelancers.
                  </p>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título do Projeto *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="Ex: Desenvolvimento de website em React para startup"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Mínimo 10 caracteres. Seja específico e claro. ({formData.title.length}/100)
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    rows={8}
                    placeholder="Descreva o projeto em detalhes:
- O que precisa ser feito
- Requisitos técnicos
- Prazo esperado
- Resultados esperados
- Qualquer informação relevante..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Mínimo 50 caracteres. Quanto mais detalhes, melhores propostas você receberá. ({formData.description.length}/2000)
                  </p>
                </div>

                {formData.title && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>URL do projeto:</strong> /work/p/{generateSlug(formData.title)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Budget and Category */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Orçamento e Categoria
                  </h2>
                  <p className="text-gray-600">
                    Defina sua faixa de orçamento e categoria para atrair freelancers adequados.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categoria do Projeto *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {WORK_CATEGORIES.map((category) => (
                      <label
                        key={category.value}
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                          formData.category === category.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={(e) => updateFormData({ category: e.target.value as WorkCategory })}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-1">
                      Orçamento Mínimo (BZR) *
                    </label>
                    <div className="relative">
                      <input
                        id="budgetMin"
                        type="number"
                        min="100"
                        step="100"
                        value={formData.budgetMinBZR}
                        onChange={(e) => updateFormData({ budgetMinBZR: e.target.value })}
                        placeholder="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-500">BZR</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-1">
                      Orçamento Máximo (BZR) *
                    </label>
                    <div className="relative">
                      <input
                        id="budgetMax"
                        type="number"
                        min={formData.budgetMinBZR || '100'}
                        step="100"
                        value={formData.budgetMaxBZR}
                        onChange={(e) => updateFormData({ budgetMaxBZR: e.target.value })}
                        placeholder="5000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-500">BZR</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Dicas para definir orçamento:
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Pesquise preços de mercado para projetos similares</li>
                          <li>Seja realista - orçamentos muito baixos afastam bons profissionais</li>
                          <li>Considere a complexidade e o tempo necessário</li>
                          <li>Lembre-se que qualidade tem seu preço</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Tags and Skills */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Tags e Habilidades
                  </h2>
                  <p className="text-gray-600">
                    Adicione tags relevantes para ajudar freelancers a encontrar seu projeto.
                  </p>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags do Projeto *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      id="tags"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Ex: react, nodejs, design, marketing..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Adicionar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Mínimo 2 tags. Pressione Enter ou clique em Adicionar. Use palavras-chave que freelancers buscariam.
                  </p>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested Tags */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tags sugeridas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {['frontend', 'backend', 'mobile', 'design', 'ux/ui', 'marketing', 'seo', 'copywriting', 'tradução', 'análise'].map((suggestedTag) => (
                      <button
                        key={suggestedTag}
                        type="button"
                        onClick={() => {
                          if (!formData.tags.includes(suggestedTag)) {
                            updateFormData({ tags: [...formData.tags, suggestedTag] });
                          }
                        }}
                        disabled={formData.tags.includes(suggestedTag)}
                        className="px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + {suggestedTag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review and Publish */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Revisar e Publicar
                  </h2>
                  <p className="text-gray-600">
                    Revise todas as informações antes de publicar seu projeto.
                  </p>
                </div>

                {/* Review Card */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{formData.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Categoria:</span>
                        <p className="font-medium text-gray-900">
                          {WORK_CATEGORIES.find(c => c.value === formData.category)?.label}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Orçamento:</span>
                        <p className="font-medium text-gray-900">
                          {formData.budgetMinBZR === formData.budgetMaxBZR 
                            ? `${formData.budgetMinBZR} BZR`
                            : `${formData.budgetMinBZR} - ${formData.budgetMaxBZR} BZR`
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.tags.map((tag) => (
                          <span key={tag} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Pronto para publicar!
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        Seu projeto será visível imediatamente para todos os freelancers da plataforma.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    ← Anterior
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!validateStep(step)}
                    className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !validateStep(1) || !validateStep(2) || !validateStep(3)}
                    className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Publicando...
                      </>
                    ) : (
                      '🚀 Publicar Projeto'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};