'use client';

import { FaPlus, FaVideo, FaCircle } from 'react-icons/fa';
import { livestreams } from '@/lib/api';
import { useCRUD, useModal } from '@/hooks';
import { Button, Loading, Modal, Table, Badge } from '@/components/common';
import { TransmissaoForm } from './TransmissaoForm';

export default function TransmissoesAdmin() {
  const { data, loading, create, update, remove, refresh } = useCRUD(livestreams, {
    successMessages: {
      create: 'Transmissão criada com sucesso!',
      update: 'Transmissão atualizada com sucesso!',
      delete: 'Transmissão excluída com sucesso!',
    },
  });

  const { isOpen, open, close, editingItem } = useModal();

  const handleSubmit = async (idOrData, dataIfUpdate) => {
    if (dataIfUpdate) {
      await update(idOrData, dataIfUpdate);
    } else {
      await create(idOrData);
    }
  };

  const handleToggleAoVivo = async (row) => {
    await update(row._id, {
      ...row,
      aoVivo: !row.aoVivo,
      ativa: true,
    });
    if (refresh) refresh();
  };

  const columns = [
    {
      header: 'Transmissão',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 flex items-center gap-2">
            {row.titulo}
            {row.aoVivo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-red-600 text-white">
                <FaCircle className="text-[7px] animate-ping" /> AO VIVO
              </span>
            )}
          </div>
          {row.pregador && <div className="text-xs text-purple-700 font-medium">{row.pregador}</div>}
          {row.descricao && <div className="text-xs text-gray-500 line-clamp-1">{row.descricao}</div>}
        </div>
      ),
    },
    {
      header: 'Plataforma',
      render: (row) => (
        <span className="uppercase text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-700">
          {row.plataforma || 'youtube'}
        </span>
      ),
    },
    {
      header: 'Direto (1 Clique)',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleToggleAoVivo(row)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            row.aoVivo
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700 border border-gray-200'
          }`}
        >
          {row.aoVivo ? '🔴 Encerrar Direto' : 'Colocar Ao Vivo'}
        </button>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.ativa ? 'success' : 'error'} size="sm">
          {row.ativa ? 'Visível' : 'Oculta'}
        </Badge>
      ),
    },
  ];

  if (loading && data.length === 0) {
    return <Loading text="Carregando transmissões..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transmissões ao Vivo</h2>
          <p className="text-gray-600 mt-1">
            Gira os cultos em direto (YouTube/Facebook) e ative o alerta &ldquo;Ao Vivo Agora&rdquo; no topo do site
          </p>
        </div>
        <Button variant="primary" icon={<FaPlus />} onClick={() => open()}>
          Nova Transmissão
        </Button>
      </div>

      <Table
        columns={columns}
        data={data}
        onEdit={(item) => open(item)}
        onDelete={remove}
        emptyIcon={<FaVideo />}
        emptyTitle="Nenhuma transmissão"
        emptyDescription="Crie transmissões ao vivo para sua igreja"
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={editingItem ? 'Editar Transmissão' : 'Nova Transmissão'}
        size="lg"
      >
        <TransmissaoForm
          transmissao={editingItem}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </Modal>
    </div>
  );
}
