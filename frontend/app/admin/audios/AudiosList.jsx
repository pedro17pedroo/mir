'use client';

import { FaEdit, FaTrash, FaPlay, FaHeadphones } from 'react-icons/fa';
import { Badge, Button, EmptyState } from '@/components/common';

export const AudiosList = ({ audios, loading, onEdit, onDelete }) => {
  if (loading) return null;

  if (audios.length === 0) {
    return (
      <EmptyState
        icon={<FaHeadphones />}
        title="Nenhum áudio cadastrado"
        description="Comece adicionando seu primeiro áudio"
      />
    );
  }

  return (
    <div className="space-y-4">
      {audios.map((audio) => (
        <div key={audio._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaPlay className="text-purple-600 text-xl" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {audio.titulo}
              </h3>
              <div className="flex gap-1 ml-2">
                {audio.destaque && <Badge variant="warning" size="sm">Destaque</Badge>}
                <Badge variant={audio.status === 'ativo' ? 'success' : 'error'} size="sm">
                  {audio.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            
            {audio.pregador && <p className="text-sm text-gray-600 mb-2">{audio.pregador}</p>}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {audio.duracao && <span>{audio.duracao}</span>}
              <span className="flex items-center gap-1">
                <FaHeadphones />
                {audio.reproducoes} reproduções
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {audio.categoria}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="primary" size="sm" icon={<FaEdit />} onClick={() => onEdit(audio)}>
              Editar
            </Button>
            <Button variant="danger" size="sm" icon={<FaTrash />} onClick={() => onDelete(audio._id)}>
              Excluir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
