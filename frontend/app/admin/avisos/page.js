'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaBullhorn,
  FaThumbtack,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { Button, Modal, Badge, EmptyState, Loading } from '@/components/common';
import { useCRUD, useModal } from '@/hooks';
import { avisos as avisosApi } from '@/lib/api';

const CATEGORIAS = {
  geral: 'Comunicado Geral',
  urgente: 'Aviso Importante / Urgente',
  jejum_oracao: 'Campanha de Jejum e Oração',
  departamento: 'Aviso de Departamento',
  agenda: 'Boletim / Agenda Semanal'
};

const INITIAL_FORM = {
  titulo: '',
  conteudo: '',
  categoria: 'geral',
  fixado: false,
  ativo: true
};

export default function AdminAvisosPage() {
  const { items, loading, create, update, remove } = useCRUD(avisosApi);
  const formModal = useModal();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setFormData(INITIAL_FORM);
    formModal.open(null);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      titulo: item.titulo || '',
      conteudo: item.conteudo || '',
      categoria: item.categoria || 'geral',
      fixado: Boolean(item.fixado),
      ativo: item.ativo !== false
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
      alert(err.message || 'Erro ao salvar aviso');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mural de Avisos e Boletim Dominical
          </h1>
          <p className="text-gray-600 mt-1">
            Publique comunicados oficiais, campanhas de oração e avisos da semana para a igreja
          </p>
        </div>
        <Button icon={FaPlus} onClick={handleOpenNew}>
          Novo Aviso / Comunicado
        </Button>
      </div>

      {loading ? (
        <Loading text="Carregando avisos..." />
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={FaBullhorn}
            title="Nenhum aviso publicado"
            description="Publique o boletim da semana ou avisos importantes para os membros."
            actionLabel="Publicar Primeiro Aviso"
            onAction={handleOpenNew}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-xl border p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.fixado ? 'border-purple-400 bg-purple-50/20' : 'border-gray-200'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {item.fixado && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      <FaThumbtack /> Fixado no Topo
                    </span>
                  )}
                  <Badge
                    variant={item.categoria === 'urgente' ? 'error' : 'info'}
                  >
                    {CATEGORIAS[item.categoria] || 'Comunicado'}
                  </Badge>
                  <Badge variant={item.ativo !== false ? 'success' : 'default'}>
                    {item.ativo !== false ? 'Visível' : 'Oculto'}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString('pt-AO')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.titulo}</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {item.conteudo}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => remove(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.data ? 'Editar Aviso' : 'Novo Aviso Oficial'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Aviso *
            </label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Semana de Jejum e Consagração"
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
              {Object.entries(CATEGORIAS).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo / Detalhes *
            </label>
            <textarea
              rows={4}
              required
              value={formData.conteudo}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Escreva os detalhes do comunicado..."
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.fixado}
                onChange={(e) => setFormData({ ...formData, fixado: e.target.checked })}
                className="rounded text-purple-600"
              />
              <span>Fixar no topo do mural</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                className="rounded text-purple-600"
              />
              <span>Visível no site</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={formModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Publicar Aviso
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

