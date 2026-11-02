'use client';

import { useState } from 'react';
import {
  FaUserPlus,
  FaWhatsapp,
  FaCheck,
  FaTrash,
  FaEdit,
  FaHeart
} from 'react-icons/fa';
import { Button, Modal, Badge, EmptyState, Loading } from '@/components/common';
import { useCRUD, useModal } from '@/hooks';
import { visitantes as visitantesApi } from '@/lib/api';

const LABELS_TIPO = {
  primeira_vez: '1ª Visita',
  novo_convertido: 'Novo Convertido 🙌',
  reconciliacao: 'Reconciliação',
  mudanca_igreja: 'Quer Congregar'
};

const LABELS_STATUS = {
  novo: { label: 'Novo', variant: 'error' },
  contatado: { label: 'Contatado', variant: 'warning' },
  em_discipulado: { label: 'Em Discipulado', variant: 'info' },
  integrado: { label: 'Integrado (Membro)', variant: 'success' },
  arquivado: { label: 'Arquivado', variant: 'default' }
};

export default function AdminVisitantesPage() {
  const { items, loading, update, remove, fetchAll } = useCRUD(visitantesApi);
  const editModal = useModal();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [notas, setNotas] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [statusSel, setStatusSel] = useState('contatado');
  const [saving, setSaving] = useState(false);

  const filtrados = (items || []).filter((v) => {
    if (filtroStatus === 'todos') return true;
    return v.statusConsolidacao === filtroStatus;
  });

  const handleOpenFollowUp = (v) => {
    setNotas(v.notasAcompanhamento || '');
    setResponsavel(v.responsavelConsolidacao || '');
    setStatusSel(v.statusConsolidacao || 'contatado');
    editModal.open(v);
  };

  const handleSaveFollowUp = async (e) => {
    e.preventDefault();
    if (!editModal.data) return;
    setSaving(true);
    try {
      await update(editModal.data._id, {
        statusConsolidacao: statusSel,
        notasAcompanhamento: notas,
        responsavelConsolidacao: responsavel
      });
      editModal.close();
    } catch (err) {
      alert(err.message || 'Erro ao salvar acompanhamento');
    } finally {
      setSaving(false);
    }
  };

  const handleConverterMembro = async (v) => {
    if (
      !confirm(
        `Converter "${v.nome}" em Membro Oficial da Igreja MIR e adicioná-lo(a) ao rol de membros?`
      )
    )
      return;
    try {
      const res = await visitantesApi.converterMembro(v._id);
      alert(res.data?.message || 'Integrado com sucesso!');
      fetchAll();
    } catch (err) {
      alert(err.message || 'Erro ao converter em membro');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Consolidação de Visitantes e Novos Convertidos
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe quem preencheu o cartão em /sou-novo, faça o discipulado e integre novos membros
          </p>
        </div>
      </div>

      {/* KPIs do Funil */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Novos (Sem Contato)</p>
          <p className="text-2xl font-bold text-red-600">
            {items.filter((i) => i.statusConsolidacao === 'novo').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Novos Convertidos 🙌</p>
          <p className="text-2xl font-bold text-purple-700">
            {items.filter((i) => i.tipoVisita === 'novo_convertido').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Em Discipulado</p>
          <p className="text-2xl font-bold text-blue-600">
            {items.filter((i) => i.statusConsolidacao === 'em_discipulado').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Integrados como Membro</p>
          <p className="text-2xl font-bold text-green-600">
            {items.filter((i) => i.statusConsolidacao === 'integrado').length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'novo', label: 'Novos' },
          { id: 'contatado', label: 'Contatados' },
          { id: 'em_discipulado', label: 'Em Discipulado' },
          { id: 'integrado', label: 'Integrados' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFiltroStatus(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              filtroStatus === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading text="Carregando lista de acolhimento..." />
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={FaHeart}
            title="Nenhum visitante nesta etapa"
            description="Os cartões preenchidos em /sou-novo aparecerão aqui."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtrados.map((v) => {
            const st = LABELS_STATUS[v.statusConsolidacao] || LABELS_STATUS.novo;
            const cleanPhone = (v.telefone || '').replace(/\D/g, '');
            return (
              <div
                key={v._id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                        {LABELS_TIPO[v.tipoVisita] || 'Visitante'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{v.nome}</h3>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 mb-3">
                    <p>
                      <strong>Tel:</strong> {v.telefone}{' '}
                      {v.bairro ? `• Bairro: ${v.bairro}` : ''}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {v.desejaCelula && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                          Quer Célula
                        </span>
                      )}
                      {v.desejaVisitaPastoral && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded">
                          Pede Visita Pastoral
                        </span>
                      )}
                      {v.desejaBatismo && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
                          Quer Batismo
                        </span>
                      )}
                    </div>
                    {v.observacoes && (
                      <p className="bg-gray-50 p-2 rounded mt-2 text-gray-700">
                        &ldquo;{v.observacoes}&rdquo;
                      </p>
                    )}
                    {v.notasAcompanhamento && (
                      <p className="bg-purple-50 p-2 rounded mt-2 text-purple-900">
                        <strong>Consolidação ({v.responsavelConsolidacao || 'Equipa'}):</strong>{' '}
                        {v.notasAcompanhamento}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-400">
                    {new Date(v.createdAt).toLocaleDateString('pt-AO')}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Olá ${v.nome}, a paz do Senhor! Que alegria ter recebido você na Igreja MIR! Aqui é da equipa de acolhimento.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-700"
                      >
                        <FaWhatsapp /> Boas-vindas
                      </a>
                    )}
                    <button
                      onClick={() => handleOpenFollowUp(v)}
                      className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <FaEdit /> Acompanhar
                    </button>
                    {v.statusConsolidacao !== 'integrado' && (
                      <button
                        onClick={() => handleConverterMembro(v)}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                        title="Converter em Membro Oficial"
                      >
                        <FaUserPlus /> Tornar Membro
                      </button>
                    )}
                    <button
                      onClick={() => remove(v._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title={`Consolidação — ${editModal.data?.nome || ''}`}
      >
        <form onSubmit={handleSaveFollowUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etapa de Consolidação
            </label>
            <select
              value={statusSel}
              onChange={(e) => setStatusSel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="novo">Novo</option>
              <option value="contatado">Contatado</option>
              <option value="em_discipulado">Em Discipulado / Célula</option>
              <option value="integrado">Integrado como Membro</option>
              <option value="arquivado">Arquivado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Obreiro / Líder Responsável pelo Acompanhamento
            </label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Nome do consolidador"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relatório do Contato / Visita
            </label>
            <textarea
              rows={3}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Anote como foi a ligação, visita ou encaminhamento para célula..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={editModal.close}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving} icon={FaCheck}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

