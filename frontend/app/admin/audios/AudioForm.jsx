'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Button } from '@/components/common';

export const AudioForm = ({ audio, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    audioUrl: '',
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
    if (audio) {
      setFormData({
        titulo: audio.titulo || '',
        descricao: audio.descricao || '',
        audioUrl: audio.audioUrl || '',
        thumbnail: audio.thumbnail || '',
        duracao: audio.duracao || '',
        pregador: audio.pregador || '',
        categoria: audio.categoria || 'pregacao',
        tags: audio.tags ? audio.tags.join(', ') : '',
        destaque: audio.destaque ?? false,
        status: audio.status || 'ativo'
      });
    }
  }, [audio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      
      if (audio) {
        await onSubmit(audio._id, dataToSend);
      } else {
        await onSubmit(dataToSend);
      }
      onCancel();
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL do Áudio *
        </label>
        <input
          type="url"
          required
          value={formData.audioUrl}
          onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
          placeholder="https://exemplo.com/audio.mp3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração
          </label>
          <input
            type="text"
            value={formData.duracao}
            onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
            placeholder="Ex: 35:20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          <option value="devocional">Devocional</option>
          <option value="podcast">Podcast</option>
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
          placeholder="vitória, fé, desafios (separadas por vírgula)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          placeholder="https://exemplo.com/thumb.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
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
            Áudio em Destaque
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
          {audio ? 'Atualizar' : 'Criar'} Áudio
        </Button>
      </div>
    </form>
  );
};
