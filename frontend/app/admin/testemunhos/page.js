'use client';

import { FaPlus } from 'react-icons/fa';
import { testemunhos } from '@/lib/api';
import { useCRUD, useModal } from '@/hooks';
import { Button, Loading, Modal } from '@/components/common';
import { TestemunhosList } from './TestemunhosList';
import { TestemunhoForm } from './TestemunhoForm';

export default function TestemunhosAdmin() {
  const { data, loading, create, update, remove } = useCRUD(testemunhos, {
    successMessages: {
      create: 'Testemunho criado com sucesso!',
      update: 'Testemunho atualizado com sucesso!',
      delete: 'Testemunho excluído com sucesso!'
    }
  });

  const { isOpen, open, close, editingItem } = useModal();

  const handleSubmit = async (idOrData, dataIfUpdate) => {
    if (dataIfUpdate) {
      await update(idOrData, dataIfUpdate);
    } else {
      await create(idOrData);
    }
  };

  const handleApprove = async (testemunho) => {
    await update(testemunho._id, { status: 'ativo', ativo: true });
  };

  if (loading && data.length === 0) {
    return <Loading text="Carregando testemunhos..." />;
  }

  const pendentesCount = data.filter((t) => t.status === 'pendente').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Testemunhos</h2>
          <p className="text-gray-600 mt-1">
            Gerencie e aprove testemunhos enviados pelos membros no site
            {pendentesCount > 0 && (
              <span className="ml-2 px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                {pendentesCount} aguardando aprovação
              </span>
            )}
          </p>
        </div>
        <Button variant="primary" icon={<FaPlus />} onClick={() => open()}>
          Novo Testemunho
        </Button>
      </div>

      <TestemunhosList
        testemunhos={data}
        loading={loading}
        onEdit={(item) => open(item)}
        onDelete={remove}
        onApprove={handleApprove}
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={editingItem ? 'Editar Testemunho' : 'Novo Testemunho'}
        size="lg"
      >
        <TestemunhoForm
          testemunho={editingItem}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </Modal>
    </div>
  );
}
