'use client';

import { useState } from 'react';
import {
  FaPrayingHands,
  FaLock,
  FaGlobe,
  FaWhatsapp,
  FaReply,
  FaTrash,
  FaCheck
} from 'react-icons/fa';
import { Button, Modal, Badge, EmptyState, Loading } from '@/components/common';
import { useCRUD, useModal } from '@/hooks';
import { oracoes as oracoesApi } from '@/lib/api';

export default function AdminOracoesPage() {
  const { items, loading, update, remove } = useCRUD(oracoesApi);
  const replyModal = useModal();
  const [respostaPastoral, setRespostaPastoral] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('respondido');
  const [saving, setSaving] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroPrivacidade, setFiltroPrivacidade] = useState('todos');

  const filtrados = items.filter((item) => {
    if (filtroStatus !== 'todos' && item.status !== filtroStatus) return false;
    if (filtroPrivacidade !== 'todos' && item.privacidade !== filtroPrivacidade) return false;
    return true;
  });

  const handleOpenReply = (item) => {
    setRespostaPastoral(item.respostaPastoral || '');
    setStatusSelecionado(item.status === 'novo' ? 'em_oracao' : item.status);
    replyModal.open(item);
  };

  const handleSaveReply = async (e) => {
    e.preventDefault();
    if (!replyModal.data) return;
    setSaving(true);
    try {
      await update(replyModal.data._id, {
        status: statusSelecionado,
        respostaPastoral
      });
      replyModal.close();
    } catch (err) {
      alert(err.message || 'Erro ao atualizar pedido');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (id, status) => {
    try {
      await update(id, { status });
    } catch (err) {
      alert(err.message || 'Erro ao alterar status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este pedido de oração?')) return;
    try {
      await remove(id);
    } catch (err) {
      alert(err.message || 'Erro ao excluir');
    }
  };

  const totalNovos = items.filter((i) => i.status === 'novo').length;
  const totalConfidenciais = items.filter((i) => i.privacidade === 'pastoral').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Pedidos de Oração e Aconselhamento
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe os pedidos do mural público e as solicitações confidenciais enviadas aos pastores
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total de Pedidos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{items.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Novos / Aguardando Oração</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{totalNovos}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Confidenciais (Só Pastores)</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">{totalConfidenciais}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'novo', label: 'Novos' },
            { id: 'em_oracao', label: 'Em Oração' },
            { id: 'respondido', label: 'Respondidos' },
            { id: 'arquivado', label: 'Arquivados' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFiltroStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filtroStatus === st.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <select
          value={filtroPrivacidade}
          onChange={(e) => setFiltroPrivacidade(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium"
        >
          <option value="todos">Todas as Privacidades</option>
          <option value="publico">Mural Público</option>
          <option value="pastoral">Confidencial (Pastoral)</option>
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <Loading text="Carregando pedidos de oração..." />
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={FaPrayingHands}
            title="Nenhum pedido encontrado"
            description="Os pedidos enviados na página /oracao aparecerão aqui."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filtrados.map((item) => {
            const cleanPhone = (item.telefone || '').replace(/\D/g, '');
            return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.nome} {item.anonimo && <span className="text-xs text-gray-500">(Anônimo no mural)</span>}
                    </h3>
                    <Badge
                      variant={
                        item.privacidade === 'pastoral' ? 'warning' : 'info'
                      }
                    >
                      {item.privacidade === 'pastoral' ? (
                        <span className="flex items-center gap-1">
                          <FaLock className="w-3 h-3" /> Confidencial Pastoral
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FaGlobe className="w-3 h-3" /> Mural Público
                        </span>
                      )}
                    </Badge>
                    <Badge
                      variant={
                        item.status === 'respondido'
                          ? 'success'
                          : item.status === 'em_oracao'
                          ? 'info'
                          : 'default'
                      }
                    >
                      {item.status === 'novo'
                        ? 'Novo'
                        : item.status === 'em_oracao'
                        ? 'Em Oração'
                        : item.status === 'respondido'
                        ? 'Respondido'
                        : 'Arquivado'}
                    </Badge>
                  </div>

                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString('pt-AO')}
                  </span>
                </div>

                <p className="text-gray-700 text-sm whitespace-pre-line bg-gray-50 p-4 rounded-xl mb-4">
                  {item.pedido}
                </p>

                {item.respostaPastoral && (
                  <div className="mb-4 p-3 rounded-lg bg-purple-50 border border-purple-100 text-xs text-purple-900">
                    <strong>Nota / Resposta Pastoral:</strong> {item.respostaPastoral}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
                  <div className="flex flex-wrap gap-4">
                    {item.telefone && <span>Tel: {item.telefone}</span>}
                    {item.email && <span>E-mail: {item.email}</span>}
                    <span>🙏 {item.contadorOracoes || 0} intercessões no mural</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.status === 'novo' && (
                      <button
                        onClick={() => handleQuickStatus(item._id, 'em_oracao')}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium flex items-center gap-1"
                      >
                        <FaCheck className="w-3 h-3" /> Marcar Em Oração
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenReply(item)}
                      className="px-3 py-1.5 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-medium flex items-center gap-1"
                    >
                      <FaReply className="w-3 h-3" /> Responder / Atualizar
                    </button>
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `A paz do Senhor, ${item.nome}! Aqui é da equipa pastoral da Igreja MIR. Recebemos o seu pedido de oração e estamos intercedendo por si.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium flex items-center gap-1"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Excluir"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Resposta Pastoral */}
      <Modal
        isOpen={replyModal.isOpen}
        onClose={replyModal.close}
        title={`Acompanhamento Pastoral — ${replyModal.data?.nome || ''}`}
      >
        <form onSubmit={handleSaveReply} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status do Pedido
            </label>
            <select
              value={statusSelecionado}
              onChange={(e) => setStatusSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="novo">Novo</option>
              <option value="em_oracao">Em Oração</option>
              <option value="respondido">Respondido / Atendido</option>
              <option value="arquivado">Arquivado (Ocultar do mural)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Palavra Pastoral / Nota de Encorajamento
            </label>
            <textarea
              rows={4}
              value={respostaPastoral}
              onChange={(e) => setRespostaPastoral(e.target.value)}
              placeholder="Escreva uma palavra pastoral ou versículo (se o pedido for público, aparecerá abaixo do pedido no mural)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={replyModal.close}>
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

