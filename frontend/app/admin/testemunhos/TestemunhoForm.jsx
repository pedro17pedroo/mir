'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Button, ImageUploader } from '@/components/common';

export const TestemunhoForm = ({ testemunho, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    texto: '',
    foto: '',
    ativo: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testemunho) {
      setFormData({
        nome: testemunho.nome || '',
        texto: testemunho.texto || testemunho.mensagem || '',
        foto: testemunho.foto || '',
        ativo: testemunho.ativo ?? (testemunho.status !== 'inativo')
      });
    }
  }, [testemunho]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        mensagem: formData.texto,
        status: formData.ativo ? 'ativo' : 'inativo'
      };
      if (testemunho) {
        await onSubmit(testemunho._id, payload);
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          required
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Nome da pessoa"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Testemunho *
        </label>
        <textarea
          rows={6}
          required
          value={formData.texto}
          onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Compartilhe o testemunho..."
        />
      </div>

      <ImageUploader
        label="Fotografia da Pessoa (Opcional)"
        value={formData.foto}
        onChange={(val) => setFormData({ ...formData, foto: val })}
        aspectRatio="square"
        maxWidth={500}
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.ativo}
          onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Testemunho Ativo
        </label>
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
          {testemunho ? 'Atualizar' : 'Criar'} Testemunho
        </Button>
      </div>
    </form>
  );
};
