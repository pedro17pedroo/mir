'use client';

import { FaEdit, FaTrash, FaQuoteLeft, FaCheck } from 'react-icons/fa';
import { Badge, Button, EmptyState } from '@/components/common';

export const TestemunhosList = ({ testemunhos, loading, onEdit, onDelete, onApprove }) => {
  if (loading) {
    return null;
  }

  if (testemunhos.length === 0) {
    return (
      <EmptyState
        icon={<FaQuoteLeft />}
        title="Nenhum testemunho cadastrado"
        description="Comece adicionando testemunhos dos membros da igreja"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testemunhos.map((testemunho) => {
        const isPendente = testemunho.status === 'pendente';
        const isAtivo = testemunho.ativo !== false && testemunho.status === 'ativo';

        return (
          <div
            key={testemunho._id}
            className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col justify-between ${
              isPendente ? 'border-2 border-amber-400' : ''
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <FaQuoteLeft className="text-purple-600 text-2xl mr-3 flex-shrink-0" />
                <Badge
                  variant={isPendente ? 'warning' : isAtivo ? 'success' : 'error'}
                  size="sm"
                >
                  {isPendente
                    ? 'Aguardando Aprovação'
                    : isAtivo
                    ? 'Publicado'
                    : 'Inativo'}
                </Badge>
              </div>

              <p className="text-gray-700 mb-4 italic line-clamp-4">
                &ldquo;{testemunho.texto || testemunho.mensagem}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center">
                {testemunho.foto ? (
                  <img
                    src={testemunho.foto}
                    alt={testemunho.nome}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">
                      {(testemunho.nome || 'T').charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-900 block text-sm">
                    {testemunho.nome}
                  </span>
                  {testemunho.local && (
                    <span className="text-xs text-gray-500">{testemunho.local}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 items-center">
                {!isAtivo && onApprove && (
                  <button
                    onClick={() => onApprove(testemunho)}
                    className="px-2.5 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                    title="Aprovar e Publicar no Site"
                  >
                    <FaCheck /> Aprovar
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<FaEdit />}
                  onClick={() => onEdit(testemunho)}
                  className="p-2"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<FaTrash />}
                  onClick={() => onDelete(testemunho._id)}
                  className="p-2 text-red-600 hover:bg-red-50"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
