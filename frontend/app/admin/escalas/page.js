'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaCalendarCheck,
  FaWhatsapp,
  FaEdit,
  FaTrash,
  FaUserCheck,
  FaShareAlt
} from 'react-icons/fa';
import { Button, Modal, Badge, EmptyState, Loading } from '@/components/common';
import { useCRUD, useModal } from '@/hooks';
import { escalas as escalasApi } from '@/lib/api';
import WhatsAppEscalaModal from '@/components/escalas/WhatsAppEscalaModal';

const FUNCOES_PADRAO = [
  'Pregador(a)',
  'Dirigente do Culto',
  'Ministério de Louvor',
  'Recepção / Diaconato',
  'Mídia / Projeção e Som',
  'Ministério Infantil',
  'Intercessão'
];

const INITIAL_FORM = {
  titulo: 'Culto de Celebração Dominical',
  dataCulto: '',
  horario: '09:00',
  local: 'Templo Principal',
  observacoes: '',
  publicada: true,
  equipa: [
    { funcao: 'Pregador(a)', nome: '', telefone: '' },
    { funcao: 'Dirigente do Culto', nome: '', telefone: '' },
    { funcao: 'Ministério de Louvor', nome: '', telefone: '' },
    { funcao: 'Recepção / Diaconato', nome: '', telefone: '' },
    { funcao: 'Mídia / Projeção e Som', nome: '', telefone: '' }
  ]
};

export default function AdminEscalasPage() {
  const { items, loading, create, update, remove } = useCRUD(escalasApi);
  const formModal = useModal();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [escalaParaWhatsApp, setEscalaParaWhatsApp] = useState(null);

  const handleOpenNew = () => {
    setFormData(INITIAL_FORM);
    formModal.open(null);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      titulo: item.titulo || '',
      dataCulto: item.dataCulto
        ? new Date(item.dataCulto).toISOString().split('T')[0]
        : '',
      horario: item.horario || '09:00',
      local: item.local || 'Templo Principal',
      observacoes: item.observacoes || '',
      publicada: item.publicada !== false,
      equipa:
        item.equipa?.length > 0
          ? item.equipa
          : INITIAL_FORM.equipa
    });
    formModal.open(item);
  };

  const handleAddEscalado = () => {
    setFormData({
      ...formData,
      equipa: [...formData.equipa, { funcao: 'Recepção / Diaconato', nome: '', telefone: '' }]
    });
  };

  const handleRemoveEscalado = (idx) => {
    setFormData({
      ...formData,
      equipa: formData.equipa.filter((_, i) => i !== idx)
    });
  };

  const handleChangeEscalado = (idx, field, val) => {
    const nova = [...formData.equipa];
    nova[idx] = { ...nova[idx], [field]: val };
    setFormData({ ...formData, equipa: nova });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        equipa: formData.equipa.filter((eq) => eq.nome && eq.nome.trim() !== '')
      };
      if (formModal.data?._id) {
        await update(formModal.data._id, payload);
      } else {
        await create(payload);
      }
      formModal.close();
    } catch (err) {
      alert(err.message || 'Erro ao salvar escala');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Escala de Obreiros e Voluntários
          </h1>
          <p className="text-gray-600 mt-1">
            Organize as equipas de serviço dos cultos (Louvor, Diaconato, Mídia, Infantil) e notifique no WhatsApp
          </p>
        </div>
        <Button icon={FaPlus} onClick={handleOpenNew}>
          Nova Escala de Culto
        </Button>
      </div>

      {loading ? (
        <Loading text="Carregando escalas..." />
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={FaCalendarCheck}
            title="Nenhuma escala cadastrada"
            description="Crie a escala do próximo culto para organizar os obreiros e voluntários."
            actionLabel="Criar Primeira Escala"
            onAction={handleOpenNew}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((escala) => {
            const dataFormatada = escala.dataCulto
              ? new Date(escala.dataCulto).toLocaleDateString('pt-AO', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC'
                })
              : '';

            return (
              <div
                key={escala._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white p-5 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{escala.titulo}</h3>
                      <p className="text-xs text-purple-200 capitalize mt-0.5">
                        {dataFormatada} às {escala.horario} • {escala.local}
                      </p>
                    </div>
                    <Badge variant={escala.publicada ? 'success' : 'default'}>
                      {escala.publicada ? 'Publicada' : 'Rascunho'}
                    </Badge>
                  </div>

                  <div className="p-5 divide-y divide-gray-100">
                    {(escala.equipa || []).map((membro, idx) => {
                      const cleanPhone = (membro.telefone || '').replace(/\D/g, '');
                      return (
                        <div
                          key={idx}
                          className="py-2.5 flex items-center justify-between text-sm"
                        >
                          <div>
                            <span className="text-xs font-bold text-purple-700 uppercase block">
                              {membro.funcao}
                            </span>
                            <span className="font-medium text-gray-900">{membro.nome}</span>
                          </div>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                `A paz do Senhor, ${membro.nome}! Lembramos que você está escalado(a) na função "${membro.funcao}" para o ${escala.titulo} (${dataFormatada} às ${escala.horario}). Contamos consigo!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <FaWhatsapp /> Lembrar
                            </a>
                          )}
                        </div>
                      );
                    })}
                    {escala.observacoes && (
                      <p className="pt-3 text-xs text-gray-500 italic">
                        Obs: {escala.observacoes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setEscalaParaWhatsApp(escala)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition border border-emerald-200/60 shadow-sm"
                  >
                    <FaWhatsapp className="text-sm text-emerald-600" />
                    Card WhatsApp
                  </button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={FaEdit}
                      onClick={() => handleOpenEdit(escala)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={FaTrash}
                      onClick={() => remove(escala._id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Criar / Editar Escala */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.data ? 'Editar Escala de Culto' : 'Nova Escala de Culto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Culto / Reunião *
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.dataCulto}
                onChange={(e) => setFormData({ ...formData, dataCulto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Local
              </label>
              <input
                type="text"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-800 uppercase">
                Obreiros e Voluntários Escalados
              </label>
              <button
                type="button"
                onClick={handleAddEscalado}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800"
              >
                + Adicionar Função
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {formData.equipa.map((eq, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <input
                      list="funcoes-sugeridas"
                      value={eq.funcao}
                      onChange={(e) => handleChangeEscalado(idx, 'funcao', e.target.value)}
                      placeholder="Função"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={eq.nome}
                      onChange={(e) => handleChangeEscalado(idx, 'nome', e.target.value)}
                      placeholder="Nome do Obreiro"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="tel"
                      value={eq.telefone || ''}
                      onChange={(e) => handleChangeEscalado(idx, 'telefone', e.target.value)}
                      placeholder="WhatsApp"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveEscalado(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <datalist id="funcoes-sugeridas">
                {FUNCOES_PADRAO.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Observações (Uniforme, horário de ensaio, etc.)
            </label>
            <input
              type="text"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Ex: Chegar 30 minutos antes para oração com a equipa."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={formModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Salvar Escala
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Card e Texto WhatsApp */}
      <WhatsAppEscalaModal
        escala={escalaParaWhatsApp}
        isOpen={Boolean(escalaParaWhatsApp)}
        onClose={() => setEscalaParaWhatsApp(null)}
        nomeIgreja="Igreja MIR"
      />
    </div>
  );
}

