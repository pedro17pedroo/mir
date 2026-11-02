'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Button } from '@/components/common';

export const VideoForm = ({ video, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipoVideo: 'youtube',
    youtubeId: '',
    vimeoId: '',
    videoUrl: '',
    thumbnail: '',
    duracao: '',
    pregador: '',
    categoria: 'pregacao',
    tags: '',
    destaque: false,
    status: 'ativo'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) {
      setFormData({
        titulo: video.titulo || '',
        descricao: video.descricao || '',
        tipoVideo: video.tipoVideo || 'youtube',
        youtubeId: video.youtubeId || '',
        vimeoId: video.vimeoId || '',
        videoUrl: video.videoUrl || '',
        thumbnail: video.thumbnail || '',
        duracao: video.duracao || '',
        pregador: video.pregador || '',
        categoria: video.categoria || 'pregacao',
        tags: video.tags?.join(', ') || '',
        destaque: video.destaque ?? false,
        status: video.status || 'ativo'
      });
    }
  }, [video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (video) {
        await onSubmit(video._id, dataToSubmit);
      } else {
        await onSubmit(dataToSubmit);
      }
      onCancel();
    } catch (error) {
      // Erro já tratado pelo useCRUD
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          type="text"
          required
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Título do vídeo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          rows={3}
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Descrição do vídeo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Vídeo *
        </label>
        <select
          value={formData.tipoVideo}
          onChange={(e) => setFormData({ ...formData, tipoVideo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="upload">Upload Próprio</option>
        </select>
      </div>

      {formData.tipoVideo === 'youtube' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID do YouTube *
          </label>
          <input
            type="text"
            required
            value={formData.youtubeId}
            onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: dQw4w9WgXcQ"
          />
          <p className="text-xs text-gray-500 mt-1">
            O ID está na URL: youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
          </p>
        </div>
      )}

      {formData.tipoVideo === 'vimeo' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID do Vimeo *
          </label>
          <input
            type="text"
            required
            value={formData.vimeoId}
            onChange={(e) => setFormData({ ...formData, vimeoId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: 123456789"
          />
        </div>
      )}

      {formData.tipoVideo === 'upload' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL do Vídeo *
          </label>
          <input
            type="url"
            required
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://exemplo.com/video.mp4"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração
          </label>
          <input
            type="text"
            value={formData.duracao}
            onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: 45:30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pregador
          </label>
          <input
            type="text"
            value={formData.pregador}
            onChange={(e) => setFormData({ ...formData, pregador: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Nome do pregador"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria *
        </label>
        <select
          value={formData.categoria}
          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="pregacao">Pregação</option>
          <option value="ensino">Ensino</option>
          <option value="louvor">Louvor</option>
          <option value="testemunho">Testemunho</option>
          <option value="evento">Evento</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="fé, transformação, poder (separadas por vírgula)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL da Thumbnail (opcional)
        </label>
        <input
          type="url"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="https://exemplo.com/thumb.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Se vazio, usará a thumbnail automática do YouTube/Vimeo
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.destaque}
            onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Vídeo em Destaque
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={<FaSave />}
          loading={loading}
        >
          {video ? 'Atualizar' : 'Criar'} Vídeo
        </Button>
      </div>
    </form>
  );
};
