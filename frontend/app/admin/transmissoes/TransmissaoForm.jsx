'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Button, ImageUploader } from '@/components/common';

export const TransmissaoForm = ({ transmissao, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    pregador: '',
    descricao: '',
    urlVideo: '',
    thumbnail: '',
    plataforma: 'youtube',
    aoVivo: false,
    ativa: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transmissao) {
      setFormData({
        titulo: transmissao.titulo || '',
        pregador: transmissao.pregador || '',
        descricao: transmissao.descricao || '',
        urlVideo: transmissao.urlVideo || transmissao.url || '',
        thumbnail: transmissao.thumbnail || '',
        plataforma: transmissao.plataforma || 'youtube',
        aoVivo: Boolean(transmissao.aoVivo),
        ativa: transmissao.ativa ?? transmissao.status !== 'finalizada',
      });
    }
  }, [transmissao]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        url: formData.urlVideo,
        status: formData.ativa ? 'ativa' : 'finalizada',
      };
      if (transmissao) {
        await onSubmit(transmissao._id, payload);
      } else {
        await onSubmit(payload);
      }
      onCancel();
    } catch (error) {
      // Erro já tratado pelo useCRUD
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título do Culto / Transmissão *
          </label>
          <input
            type="text"
            required
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ex: Culto de Celebração - Domingo da Família"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pregador / Ministro
          </label>
          <input
            type="text"
            value={formData.pregador}
            onChange={(e) => setFormData({ ...formData, pregador: e.target.value })}
            placeholder="Ex: Pastor Presidente"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma
          </label>
          <select
            value={formData.plataforma}
            onChange={(e) => setFormData({ ...formData, plataforma: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook Live</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL do Vídeo / Direto (YouTube, Facebook ou Vimeo) *
        </label>
        <input
          type="text"
          required
          value={formData.urlVideo}
          onChange={(e) => setFormData({ ...formData, urlVideo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resumo / Tema da Mensagem
        </label>
        <textarea
          rows={3}
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <ImageUploader
        label="Imagem de Capa (Opcional)"
        value={formData.thumbnail}
        onChange={(val) => setFormData({ ...formData, thumbnail: val })}
        aspectRatio="video"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-red-200 bg-red-50/60 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.aoVivo}
            onChange={(e) => setFormData({ ...formData, aoVivo: e.target.checked, ativa: true })}
            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <div>
            <span className="block text-sm font-bold text-red-800">
              🔴 Transmitindo Ao Vivo Agora
            </span>
            <span className="text-xs text-red-600">
              Destaca este player no topo e exibe o alerta de direto no menu do site
            </span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.ativa}
            onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
            className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <div>
            <span className="block text-sm font-semibold text-gray-900">
              Visível na Galeria de Transmissões
            </span>
            <span className="text-xs text-gray-500">
              Desmarque para ocultar do público
            </span>
          </div>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" icon={<FaSave />} loading={loading}>
          {transmissao ? 'Atualizar' : 'Criar'} Transmissão
        </Button>
      </div>
    </form>
  );
};
