'use client';

import { FaPlus, FaDownload, FaWhatsapp, FaTrash } from 'react-icons/fa';
import { eventos } from '@/lib/api';
import { useCRUD, useModal } from '@/hooks';
import { Button, Loading, Modal } from '@/components/common';
import { EventosList } from './EventosList';
import { EventoForm } from './EventoForm';

export default function EventosAdmin() {
  const { data, loading, create, update, remove, fetchAll } = useCRUD(eventos, {
    successMessages: {
      create: 'Evento criado com sucesso!',
      update: 'Evento atualizado com sucesso!',
      delete: 'Evento excluído com sucesso!'
    }
  });

  const { isOpen, open, close, editingItem } = useModal();
  const inscritosModal = useModal();

  const handleEdit = (evento) => {
    open(evento);
  };

  const handleSubmit = async (idOrData, dataIfUpdate) => {
    if (dataIfUpdate) {
      await update(idOrData, dataIfUpdate);
    } else {
      await create(idOrData);
    }
  };

  const handleRemoverInscrito = async (eventoId, inscritoId) => {
    if (!confirm('Remover esta inscrição do evento?')) return;
    try {
      const res = await eventos.removerInscrito(eventoId, inscritoId);
      inscritosModal.open(res.data);
      fetchAll();
    } catch (err) {
      alert(err.message || 'Erro ao remover inscrito');
    }
  };

  const handleExportCSV = (evento) => {
    const lista = evento?.inscritos || [];
    if (!lista.length) return;
    const headers = ['Nome', 'Telefone', 'Email', 'Acompanhantes', 'Observacoes', 'DataInscricao'];
    const rows = lista.map((i) => [
      `"${(i.nome || '').replace(/"/g, '""')}"`,
      `"${(i.telefone || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      i.acompanhantes || 0,
      `"${(i.observacoes || '').replace(/"/g, '""')}"`,
      new Date(i.dataInscricao).toLocaleDateString('pt-AO')
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inscritos-${evento.slug || 'evento'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && data.length === 0) {
    return <Loading text="Carregando eventos..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Eventos</h2>
          <p className="text-gray-600 mt-1">
            Gerencie eventos da igreja, capacidade de vagas e lista de participantes inscritos
          </p>
        </div>
        <Button variant="primary" icon={<FaPlus />} onClick={() => open()}>
          Novo Evento
        </Button>
      </div>

      {/* Lista de Eventos */}
      <EventosList
        eventos={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={remove}
        onViewInscritos={(ev) => inscritosModal.open(ev)}
      />

      {/* Modal de Formulário */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        title={editingItem ? 'Editar Evento' : 'Novo Evento'}
        size="lg"
      >
        <EventoForm
          evento={editingItem}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </Modal>

      {/* Modal de Inscritos */}
      <Modal
        isOpen={inscritosModal.isOpen}
        onClose={inscritosModal.close}
        title={`Participantes Inscritos — ${inscritosModal.data?.titulo || ''}`}
        size="lg"
      >
        {!inscritosModal.data?.inscritos?.length ? (
          <p className="text-center text-gray-500 py-8">
            Nenhuma inscrição realizada online para este evento até o momento.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <span className="text-sm font-medium text-purple-900">
                Total de inscrições: <strong>{inscritosModal.data.inscritos.length}</strong> (
                {inscritosModal.data.inscritos.reduce(
                  (acc, i) => acc + 1 + (i.acompanhantes || 0),
                  0
                )}{' '}
                pessoas contando acompanhantes)
              </span>
              <Button
                size="sm"
                variant="outline"
                icon={<FaDownload />}
                onClick={() => handleExportCSV(inscritosModal.data)}
              >
                Exportar CSV
              </Button>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {inscritosModal.data.inscritos.map((inscrito) => {
                const cleanPhone = (inscrito.telefone || '').replace(/\D/g, '');
                return (
                  <div
                    key={inscrito._id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {inscrito.nome}{' '}
                        {inscrito.acompanhantes > 0 && (
                          <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            +{inscrito.acompanhantes} acompanhante(s)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600">
                        Tel: {inscrito.telefone} {inscrito.email ? `• ${inscrito.email}` : ''}
                      </p>
                      {inscrito.observacoes && (
                        <p className="text-xs text-gray-500 mt-1">
                          Obs: {inscrito.observacoes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Olá ${inscrito.nome}, a paz do Senhor! Confirmamos a sua inscrição no evento "${inscritosModal.data.titulo}" da Igreja MIR.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-700"
                        >
                          <FaWhatsapp /> WhatsApp
                        </a>
                      )}
                      <button
                        onClick={() =>
                          handleRemoverInscrito(inscritosModal.data._id, inscrito._id)
                        }
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Remover inscrição"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
