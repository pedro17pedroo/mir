'use client';

import { useState } from 'react';
import { FaPlus, FaQuoteLeft, FaEdit, FaTrash, FaMagic, FaEye } from 'react-icons/fa';
import { mensagens } from '@/lib/api';
import { useCRUD, useModal } from '@/hooks';
import { Loading, Button, Modal, Badge, EmptyState, ImageUploader } from '@/components/common';
import { formatDate } from '@/utils';
import useSiteStore from '@/store/useSiteStore';

const INITIAL_FORM = {
  titulo: '',
  versiculo: '',
  resumo: '',
  conteudo: '',
  oracaoFinal: '',
  imagem: '',
  corGradienteInicio: '#a855f7',
  corGradienteFim: '#ec4899',
  corTexto: '#ffffff',
  corCurvaFundo: '',
  mostrarCurva: true,
  estiloCurva: 'onda',
  autor: '',
  categoria: 'Devocional Diário',
  status: 'ativo'
};

export default function MensagensAdmin() {
  const { data, loading, create, update, remove } = useCRUD(mensagens);
  const theme = useSiteStore((state) => state.theme);
  const formModal = useModal();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setFormData({
      ...INITIAL_FORM,
      corCurvaFundo: theme?.homeSecaoTestemunhosCorFundo || '#faf5ff'
    });
    formModal.open(null);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      titulo: item.titulo || '',
      versiculo: item.versiculo || '',
      resumo: item.resumo || '',
      conteudo: item.conteudo || '',
      oracaoFinal: item.oracaoFinal || '',
      imagem: item.imagem || '',
      corGradienteInicio: item.corGradienteInicio || '#a855f7',
      corGradienteFim: item.corGradienteFim || '#ec4899',
      corTexto: item.corTexto || '#ffffff',
      corCurvaFundo: item.corCurvaFundo || theme?.homeSecaoTestemunhosCorFundo || '#faf5ff',
      mostrarCurva: item.mostrarCurva !== false,
      estiloCurva: item.estiloCurva || 'onda',
      autor: item.autor || '',
      categoria: item.categoria || 'Devocional Diário',
      status: item.status || 'ativo'
    });
    formModal.open(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formModal.data?._id) {
        await update(formModal.data._id, formData);
      } else {
        await create(formData);
      }
      formModal.close();
    } catch (err) {
      alert(err.message || 'Erro ao salvar mensagem pastoral');
    } finally {
      setSaving(false);
    }
  };

  if (loading && data.length === 0) {
    return <Loading text="Carregando mensagens pastorais..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Palavra Pastoral e Versículo em Destaque
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie a citação/versículo exibido na faixa de destaque da página inicial e devocionais
          </p>
        </div>
        <Button icon={<FaPlus />} onClick={handleOpenNew}>
          Nova Mensagem / Versículo
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={<FaQuoteLeft />}
            title="Nenhuma mensagem cadastrada"
            description="Publique um versículo ou reflexão pastoral para exibir na página inicial do site."
            actionLabel="Criar Primeira Mensagem"
            onAction={handleOpenNew}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                      {item.categoria || 'Palavra Pastoral'}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{item.titulo}</h3>
                  </div>
                  <Badge variant={item.status === 'ativo' ? 'success' : 'default'}>
                    {item.status === 'ativo' ? 'Ativo na Home' : 'Inativo'}
                  </Badge>
                </div>

                {item.resumo && (
                  <p className="text-gray-800 font-medium italic mb-2">
                    &ldquo;{item.resumo}&rdquo;
                  </p>
                )}
                {item.conteudo && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.conteudo}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {item.autor ? `${item.autor} • ` : ''}
                  {formatDate(item.data || item.createdAt)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Editar"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Excluir"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.data ? 'Editar Palavra Pastoral' : 'Nova Palavra / Versículo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Mensagem / Devocional *
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: O Senhor é o meu Pastor"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Devocional Diário">Devocional Diário</option>
                <option value="Palavra Pastoral">Palavra Pastoral</option>
                <option value="Versículo da Semana">Versículo da Semana</option>
                <option value="Estudo Bíblico">Estudo Bíblico</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Versículo Base (Referência e Texto)
            </label>
            <input
              type="text"
              value={formData.versiculo}
              onChange={(e) => setFormData({ ...formData, versiculo: e.target.value })}
              placeholder="Ex: Filipenses 4:13 — Tudo posso naquele que me fortalece."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frase de Destaque (Exibida em grande na Home) *
            </label>
            <textarea
              rows={2}
              required
              value={formData.resumo}
              onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
              placeholder="Ex: Tudo posso naquele que me fortalece."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reflexão / Meditação Completa (Mural Devocional)
            </label>
            <textarea
              rows={4}
              value={formData.conteudo}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              placeholder="Escreva a meditação pastoral completa para edificar os membros..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oração do Dia (Opcional)
            </label>
            <textarea
              rows={2}
              value={formData.oracaoFinal}
              onChange={(e) => setFormData({ ...formData, oracaoFinal: e.target.value })}
              placeholder="Ex: Senhor, fortalece a minha fé neste novo dia..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Personalização Visual da Faixa na Home e Harmonização com a Próxima Secção */}
          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Design, Cores & Enquadramento com a Secção Seguinte
              </h4>
              <span className="text-[11px] text-purple-700 font-medium">
                Edição Completa de Cores
              </span>
            </div>

            <ImageUploader
              label="Imagem de Fundo (Opcional — sobrepõe ao gradiente)"
              value={formData.imagem}
              onChange={(val) => setFormData({ ...formData, imagem: val })}
              aspectRatio="banner"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Gradiente Início */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cor Inicial do Gradiente
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.corGradienteInicio || '#a855f7'}
                    onChange={(e) => setFormData({ ...formData, corGradienteInicio: e.target.value })}
                    className="h-9 w-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.corGradienteInicio || '#a855f7'}
                    onChange={(e) => setFormData({ ...formData, corGradienteInicio: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Gradiente Fim */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cor Final do Gradiente
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.corGradienteFim || '#ec4899'}
                    onChange={(e) => setFormData({ ...formData, corGradienteFim: e.target.value })}
                    className="h-9 w-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.corGradienteFim || '#ec4899'}
                    onChange={(e) => setFormData({ ...formData, corGradienteFim: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Cor do Texto e Aspas */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cor do Texto / Aspas
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.corTexto || '#ffffff'}
                    onChange={(e) => setFormData({ ...formData, corTexto: e.target.value })}
                    className="h-9 w-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.corTexto || '#ffffff'}
                    onChange={(e) => setFormData({ ...formData, corTexto: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Ajuste da Curva Ondulada e Transição Perfeita */}
            <div className="pt-3 border-t border-purple-200/60 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mostrarCurva !== false}
                    onChange={(e) => setFormData({ ...formData, mostrarCurva: e.target.checked })}
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  Exibir Curva Ondulada na Base da Faixa
                </label>

                {formData.mostrarCurva !== false && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        corCurvaFundo: theme?.homeSecaoTestemunhosCorFundo || '#faf5ff'
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 transition"
                  >
                    <FaMagic className="text-[10px]" /> Sincronizar com Fundo dos Testemunhos (
                    {theme?.homeSecaoTestemunhosCorFundo || '#faf5ff'})
                  </button>
                )}
              </div>

              {formData.mostrarCurva !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-purple-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Cor de Preenchimento da Curva Ondulada
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.corCurvaFundo || theme?.homeSecaoTestemunhosCorFundo || '#faf5ff'}
                        onChange={(e) => setFormData({ ...formData, corCurvaFundo: e.target.value })}
                        className="h-9 w-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.corCurvaFundo || theme?.homeSecaoTestemunhosCorFundo || '#faf5ff'}
                        onChange={(e) => setFormData({ ...formData, corCurvaFundo: e.target.value })}
                        placeholder={theme?.homeSecaoTestemunhosCorFundo || '#faf5ff'}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Defina a mesma cor da secção abaixo para que a transição fique 100% perfeita sem linhas brancas.
                    </p>
                  </div>

                  {/* Pré-visualização ao vivo do Enquadramento */}
                  <div className="rounded-lg overflow-hidden border border-gray-200 flex flex-col justify-between">
                    <div
                      style={{
                        background: `linear-gradient(to right, ${formData.corGradienteInicio || '#a855f7'}, ${formData.corGradienteFim || '#ec4899'})`
                      }}
                      className="p-3 relative min-h-[56px] flex items-center justify-between"
                    >
                      <span
                        style={{ color: formData.corTexto || '#ffffff' }}
                        className="text-xs font-bold truncate max-w-[80%]"
                      >
                        &ldquo;{formData.resumo || 'Frase bíblica em destaque'}&rdquo;
                      </span>
                      {/* Curva miniatura */}
                      <svg
                        viewBox="0 0 1440 200"
                        className="absolute bottom-0 left-0 right-0 w-full h-4"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,160 C320,100 420,100 720,140 C1020,180 1120,180 1440,140 L1440,200 L0,200 Z"
                          fill={formData.corCurvaFundo || theme?.homeSecaoTestemunhosCorFundo || '#faf5ff'}
                        />
                      </svg>
                    </div>
                    {/* Bloco simulando a secção inferior */}
                    <div
                      style={{
                        backgroundColor: formData.corCurvaFundo || theme?.homeSecaoTestemunhosCorFundo || '#faf5ff'
                      }}
                      className="py-1.5 px-3 text-[10px] font-bold text-center text-gray-600 border-t border-black/5"
                    >
                      Secção Seguinte (Enquadramento Perfeito ✓)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor / Pastor
              </label>
              <input
                type="text"
                value={formData.autor}
                onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                placeholder="Ex: Apóstolo / Pastor Presidente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="ativo">Ativo (Visível na Home)</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={formModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
