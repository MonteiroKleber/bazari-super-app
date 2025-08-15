// src/features/work/components/DisputeDialog.tsx
import React, { useState } from 'react';

interface DisputeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  projectTitle?: string;
  userType?: 'client' | 'freelancer';
  loading?: boolean;
}

const DISPUTE_REASONS = {
  client: [
    'Trabalho não entregue no prazo acordado',
    'Qualidade do trabalho abaixo do esperado',
    'Trabalho não atende aos requisitos especificados',
    'Freelancer não está respondendo às comunicações',
    'Trabalho incompleto ou parcialmente entregue',
    'Outro motivo'
  ],
  freelancer: [
    'Cliente não está respondendo às comunicações',
    'Cliente alterou os requisitos após o acordo',
    'Cliente está atrasando as aprovações necessárias',
    'Pagamento não foi liberado conforme acordado',
    'Cliente solicitou trabalho adicional sem compensação',
    'Outro motivo'
  ]
};

export const DisputeDialog: React.FC<DisputeDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectTitle,
  userType = 'client',
  loading = false
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reasons = DISPUTE_REASONS[userType];
  const isCustomReason = selectedReason === 'Outro motivo';
  const finalReason = isCustomReason ? customReason : selectedReason;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!finalReason.trim()) {
      alert('Por favor, selecione ou descreva o motivo da disputa.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor, forneça uma descrição detalhada da disputa.');
      return;
    }

    const fullReason = `${finalReason}\n\nDescrição: ${description.trim()}`;

    try {
      setSubmitting(true);
      await onSubmit(fullReason);
      
      // Reset form
      setSelectedReason('');
      setCustomReason('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Erro ao abrir disputa:', error);
      alert('Erro ao abrir disputa. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Abrir Disputa
                </h3>
              </div>
              <button
                onClick={onClose}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {projectTitle && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-800">
                  <span className="font-medium">Projeto:</span> {projectTitle}
                </p>
              </div>
            )}

            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    <strong>Importante:</strong> Disputas devem ser usadas apenas quando há problemas sérios que não podem ser resolvidos por comunicação direta. Elas ficam registradas permanentemente no histórico.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da disputa *
                </label>
                <div className="space-y-2">
                  {reasons.map((reason) => (
                    <label key={reason} className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        disabled={submitting}
                        className="mt-0.5 focus:ring-orange-500 text-orange-600"
                      />
                      <span className="text-sm text-gray-700 flex-1">
                        {reason}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Reason */}
              {isCustomReason && (
                <div>
                  <label htmlFor="custom-reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Descreva o motivo *
                  </label>
                  <input
                    id="custom-reason"
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Descreva o motivo da disputa..."
                    disabled={submitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição detalhada *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  disabled={submitting}
                  placeholder="Forneça todos os detalhes relevantes sobre a situação, incluindo datas, comunicações anteriores, evidências, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Seja o mais específico possível. Informações detalhadas ajudam na resolução da disputa.
                </p>
              </div>

              {/* Guidelines */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Como funciona o processo de disputa:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• A disputa será registrada no sistema de escrow</li>
                  <li>• Ambas as partes serão notificadas</li>
                  <li>• Um mediador do Bazari analisará o caso</li>
                  <li>• A resolução pode ser liberação do pagamento ou reembolso</li>
                  <li>• O processo leva de 3 a 7 dias úteis</li>
                </ul>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={!finalReason.trim() || !description.trim() || submitting || loading}
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting || loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Abrindo disputa...
                </>
              ) : (
                'Abrir Disputa'
              )}
            </button>
            <button
              type="button"
              disabled={submitting || loading}
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};