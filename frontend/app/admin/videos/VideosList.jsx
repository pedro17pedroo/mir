'use client';

import { FaEdit, FaTrash, FaPlay, FaEye } from 'react-icons/fa';
import { Badge, Button, EmptyState } from '@/components/common';

export const VideosList = ({ videos, loading, onEdit, onDelete }) => {
  if (loading) {
    return null;
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={<FaPlay />}
        title="Nenhum vídeo cadastrado"
        description="Comece adicionando seu primeiro vídeo"
      />
    );
  }

  const getThumbnail = (video) => {
    if (video.thumbnail) return video.thumbnail;
    if (video.tipoVideo === 'youtube') {
      return `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
    }
    return '/default-video-thumb.jpg';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="relative aspect-video">
            <img
              src={getThumbnail(video)}
              alt={video.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <FaPlay className="text-white text-4xl" />
            </div>
            {video.duracao && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                {video.duracao}
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
                {video.titulo}
              </h3>
              <div className="flex gap-1 ml-2">
                {video.destaque && (
                  <Badge variant="warning" size="sm">⭐</Badge>
                )}
                <Badge variant={video.status === 'ativo' ? 'success' : 'error'} size="sm">
                  {video.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              {video.pregador && (
                <div>👤 {video.pregador}</div>
              )}
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                  {video.categoria}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <FaEye />
                  {video.visualizacoes || 0}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={<FaEdit />}
                onClick={() => onEdit(video)}
                className="flex-1"
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<FaTrash />}
                onClick={() => onDelete(video._id)}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
