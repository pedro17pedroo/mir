'use client';

import { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Button, ImageUploader } from '@/components/common';

export const CarrosselForm = ({ slide, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagem: '',
    posicaoImagem: 'center',
    link: '#sobre',
    textoBotao: 'Saiba Mais',
    corBotao: '#facc15',
    textoBotaoSecundario: 'Próximos Eventos',
    linkBotaoSecundario: '#eventos',
    mostrarBotoes: true,
    ordem: 0,
    ativo: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slide) {
      setFormData({
        titulo: slide.titulo || '',
        subtitulo: slide.subtitulo || slide.descricao || slide.conteudo || '',
        imagem: slide.imagem || '',
        posicaoImagem: slide.posicaoImagem || 'center',
        link: slide.link || '#sobre',
        textoBotao: slide.textoBotao || 'Saiba Mais',
        corBotao: slide.corBotao || '#facc15',
        textoBotaoSecundario: slide.textoBotaoSecundario ?? 'Próximos Eventos',
        linkBotaoSecundario: slide.linkBotaoSecundario || '#eventos',
        mostrarBotoes: slide.mostrarBotoes !== false,
        ordem: slide.ordem || 0,
        ativo: slide.ativo ?? true
      });
    }
  }, [slide]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        descricao: formData.subtitulo,
        conteudo: formData.subtitulo,
        tipo: 'carrossel'
      };
      if (slide) {
        await onSubmit(slide._id, dataToSend);
      } else {
        await onSubmit(dataToSend);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal *</label>
        <input
          type="text"
          required
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Ex: Bem-vindo à Igreja MIR"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo / Mensagem</label>
        <input
          type="text"
          value={formData.subtitulo}
          onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Ex: Uma comunidade de fé, amor e esperança"
        />
      </div>

      <ImageUploader
        label="Imagem de Fundo do Slide (Opcional — usa gradiente do tema se vazio)"
        value={formData.imagem}
        onChange={(val) => setFormData({ ...formData, imagem: val })}
        aspectRatio="banner"
        maxWidth={1920}
        showPositionControl={true}
        positionValue={formData.posicaoImagem}
        onPositionChange={(pos) => setFormData({ ...formData, posicaoImagem: pos })}
      />

      {/* Configuração dos Botões de Ação */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Botões de Ação no Slide</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.mostrarBotoes}
              onChange={(e) => setFormData({ ...formData, mostrarBotoes: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-xs font-medium text-gray-700">Exibir Botões</span>
          </label>
        </div>

        {formData.mostrarBotoes && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Texto Botão 1</label>
              <input
                type="text"
                value={formData.textoBotao}
                onChange={(e) => setFormData({ ...formData, textoBotao: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                placeholder="Saiba Mais"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Link Botão 1</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                placeholder="/sou-novo ou #sobre"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Texto Botão 2 (vazio para ocultar)</label>
              <input
                type="text"
                value={formData.textoBotaoSecundario}
                onChange={(e) => setFormData({ ...formData, textoBotaoSecundario: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                placeholder="Próximos Eventos"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Link Botão 2</label>
              <input
                type="text"
                value={formData.linkBotaoSecundario}
                onChange={(e) => setFormData({ ...formData, linkBotaoSecundario: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                placeholder="/eventos ou #eventos"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <label className="text-xs font-medium text-gray-600">Cor de Destaque do Botão Principal:</label>
              <input
                type="color"
                value={formData.corBotao || '#facc15'}
                onChange={(e) => setFormData({ ...formData, corBotao: e.target.value })}
                className="h-8 w-14 rounded cursor-pointer border border-gray-300"
              />
              <span className="text-xs text-gray-500">{formData.corBotao}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordem de Exibição</label>
          <input
            type="number"
            value={formData.ordem}
            onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value || '0', 10) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            checked={formData.ativo}
            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-900">Slide Ativo no Site</label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" icon={<FaSave />} loading={loading}>
          {slide ? 'Atualizar' : 'Criar'} Slide
        </Button>
      </div>
    </form>
  );
};
