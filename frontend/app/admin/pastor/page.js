'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaImage, FaPalette, FaEye } from 'react-icons/fa';
import api from '@/lib/api';
import { Button, Loading, ImageUploader } from '@/components/common';
import Swal from 'sweetalert2';

export default function PastorAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: 'Conheça Nosso Pastor',
    texto: '',
    imagem: '',
    corTitulo: '#FFC107',
    corTexto: '#FFFFFF',
    corBotao: '#FFC107',
    corFundo: 'rgba(109, 40, 217, 0.85)',
    textoBotao: 'Saiba Mais',
    linkBotao: '',
    transparencia: 85 // Nível de transparência do overlay (0-100)
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sobre-pastor');
      if (response.data) {
        // Extrai transparência da corFundo se for rgba
        let transparencia = 85;
        if (response.data.corFundo && response.data.corFundo.includes('rgba')) {
          const match = response.data.corFundo.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([0-9.]+)\)/);
          if (match) {
            transparencia = Math.round(parseFloat(match[1]) * 100);
          }
        }
        
        setFormData({
          titulo: response.data.titulo || 'Conheça Nosso Pastor',
          texto: response.data.texto || '',
          imagem: response.data.imagem || '',
          corTitulo: response.data.corTitulo || '#FFC107',
          corTexto: response.data.corTexto || '#FFFFFF',
          corBotao: response.data.corBotao || '#FFC107',
          corFundo: response.data.corFundo || 'rgba(109, 40, 217, 0.85)',
          textoBotao: response.data.textoBotao || 'Saiba Mais',
          linkBotao: response.data.linkBotao || '',
          transparencia: transparencia
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Erro ao carregar dados do pastor',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validação de tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      await Swal.fire({
        icon: 'error',
        title: 'Arquivo muito grande!',
        text: 'A imagem deve ter no máximo 5MB',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagem: reader.result }));
        setUploading(false);
      };
      reader.onerror = () => {
        setUploading(false);
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao ler o arquivo de imagem',
          confirmButtonColor: '#9333ea'
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      setUploading(false);
    }
  };

  const handleTransparenciaChange = (value) => {
    const transparencia = parseInt(value);
    setFormData({ 
      ...formData, 
      transparencia,
      // Atualiza corFundo com nova transparência
      corFundo: `rgba(109, 40, 217, ${transparencia / 100})`
    });
  };

  const handleCorFundoChange = (cor) => {
    // Converte hex para rgba mantendo a transparência atual
    const hex = cor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const alpha = formData.transparencia / 100;
    
    setFormData({
      ...formData,
      corFundo: `rgba(${r}, ${g}, ${b}, ${alpha})`
    });
  };

  const getCorFundoHex = () => {
    // Extrai RGB da corFundo e converte para hex
    if (formData.corFundo.includes('rgba')) {
      const match = formData.corFundo.match(/rgba\(([^,]+),\s*([^,]+),\s*([^,]+)/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }
    return '#6D28D9';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.titulo.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: 'O título é obrigatório',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    if (!formData.texto.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: 'O texto é obrigatório',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    try {
      setSaving(true);
      await api.post('/sobre-pastor', formData);
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Dados salvos com sucesso!',
        confirmButtonColor: '#9333ea',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Erro ao salvar dados',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading text="Carregando dados do pastor..." />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Conheça Nosso Pastor</h2>
        <p className="text-gray-600 mt-1">Configure a seção sobre o pastor na landing page</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Conheça Nosso Pastor"
              />
            </div>

            {/* Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Descritivo
              </label>
              <textarea
                value={formData.texto}
                onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Descreva o pastor, sua história, missão..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.texto.length} caracteres
              </p>
            </div>

            {/* Imagem de Fundo */}
            <div>
              <ImageUploader
                label="Imagem de Fundo da Secção do Pastor"
                value={formData.imagem}
                onChange={(val) => setFormData({ ...formData, imagem: val })}
                aspectRatio="banner"
                maxWidth={1600}
                helperText="Carregue do computador ou cole o link de uma foto institucional."
              />
            </div>

            {/* Cores */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <FaPalette className="inline mr-2" />
                Cores
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cor do Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Título
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.corTitulo}
                      onChange={(e) => setFormData({ ...formData, corTitulo: e.target.value })}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.corTitulo}
                      onChange={(e) => setFormData({ ...formData, corTitulo: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Cor do Texto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Texto
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.corTexto}
                      onChange={(e) => setFormData({ ...formData, corTexto: e.target.value })}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.corTexto}
                      onChange={(e) => setFormData({ ...formData, corTexto: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Cor do Botão */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Botão
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.corBotao}
                      onChange={(e) => setFormData({ ...formData, corBotao: e.target.value })}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.corBotao}
                      onChange={(e) => setFormData({ ...formData, corBotao: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Cor de Fundo (Overlay) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Overlay
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={getCorFundoHex()}
                      onChange={(e) => handleCorFundoChange(e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.corFundo}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Transparência do Overlay */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transparência do Overlay: {formData.transparencia}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.transparencia}
                  onChange={(e) => handleTransparenciaChange(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Transparente (0%)</span>
                  <span>Opaco (100%)</span>
                </div>
              </div>
            </div>

            {/* Botão */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Botão (Opcional)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={formData.textoBotao}
                    onChange={(e) => setFormData({ ...formData, textoBotao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Saiba Mais"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link do Botão
                  </label>
                  <input
                    type="text"
                    value={formData.linkBotao}
                    onChange={(e) => setFormData({ ...formData, linkBotao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="/sobre/presidente ou https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use URL relativa (/sobre/presidente) para navegação interna ou URL completa (https://...) para sites externos. Deixe vazio para não mostrar o botão.
                  </p>
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                icon={<FaSave />}
                loading={saving}
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              <FaEye className="inline mr-2" />
              Pré-visualização
            </h3>
          </div>

          <div 
            className="relative min-h-[500px] rounded-lg overflow-hidden flex items-center"
            style={{ backgroundColor: formData.corFundo }}
          >
            {/* Imagem de fundo */}
            {formData.imagem && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={formData.imagem} 
                  alt="Background" 
                  className="object-cover w-full h-full" 
                />
                <div 
                  className="absolute inset-0" 
                  style={{ backgroundColor: formData.corFundo }}
                ></div>
              </div>
            )}

            {/* Conteúdo */}
            <div className="relative z-10 p-8 w-full">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4 leading-tight" 
                style={{ color: formData.corTitulo }}
              >
                {formData.titulo || 'Conheça Nosso Pastor'}
              </h2>
              
              <div 
                className="w-20 h-1 mb-6"
                style={{ backgroundColor: formData.corTitulo }}
              ></div>
              
              <p 
                className="text-lg leading-relaxed mb-6" 
                style={{ color: formData.corTexto }}
              >
                {formData.texto || 'Adicione um texto descritivo sobre o pastor...'}
              </p>
              
              {formData.textoBotao && formData.linkBotao && (
                <button 
                  className="inline-block font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ 
                    backgroundColor: formData.corBotao, 
                    color: '#1F2937' 
                  }}
                >
                  {formData.textoBotao}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-700">
              <strong>Dica:</strong> A pré-visualização mostra como a seção aparecerá na landing page. 
              Ajuste as cores e transparência para melhor legibilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
