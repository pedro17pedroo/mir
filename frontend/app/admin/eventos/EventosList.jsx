'use client';

import { FaEdit, FaTrash, FaCalendar, FaUsers } from 'react-icons/fa';
import { Badge, Button, EmptyState } from '@/components/common';
import { formatDate } from '@/utils';

export const EventosList = ({ eventos, loading, onEdit, onDelete, onViewInscritos }) => {
  if (loading) {
    return null;
  }

  if (eventos.length === 0) {
    return (
      <EmptyState
        icon={<FaCalendar />}
        title="Nenhum evento cadastrado"
        description="Comece criando seu primeiro evento para a igreja"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {eventos.map((evento) => {
        const totalPessoas = (evento.inscritos || []).reduce(
          (acc, i) => acc + 1 + (i.acompanhantes || 0),
          0
        );
        return (
          <div
            key={evento._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-between"
          >
            <div>
              {evento.imagem && (
                <img
                  src={evento.imagem}
                  alt={evento.titulo}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {evento.titulo}
                  </h3>
                  <div className="flex gap-2">
                    {evento.destaque && (
                      <Badge variant="warning" size="sm">
                        Destaque
                      </Badge>
                    )}
                    <Badge variant={evento.status === 'ativo' ? 'success' : 'error'} size="sm">
                      {evento.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{evento.descricao}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-purple-600" />
                    {formatDate(evento.dataInicio)}
                    {evento.horarioInicio && ` às ${evento.horarioInicio}`}
                  </div>
                  {evento.local && (
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      {evento.local}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => onViewInscritos && onViewInscritos(evento)}
                      className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1.5 text-xs"
                    >
                      <FaUsers className="w-4 h-4" />
                      <span>
                        {evento.inscritos?.length || 0} inscrições ({totalPessoas} pessoas)
                        {evento.capacidade > 0 ? ` / ${evento.capacidade} vagas` : ''}
                      </span>
                    </button>
                    {evento.preco > 0 && (
                      <span className="text-xs font-bold text-green-700">
                        {Number(evento.preco).toLocaleString('pt-AO')} Kz
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<FaUsers />}
                onClick={() => onViewInscritos && onViewInscritos(evento)}
              >
                Inscritos
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<FaEdit />}
                onClick={() => onEdit(evento)}
                className="flex-1"
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<FaTrash />}
                onClick={() => onDelete(evento._id)}
              >
                Excluir
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
