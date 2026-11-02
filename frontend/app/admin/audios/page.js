'use client';

import { FaPlus } from 'react-icons/fa';
import { audios } from '@/lib/api';
import { useCRUD, useModal } from '@/hooks';
import { Button, Loading, Modal } from '@/components/common';
import { AudiosList } from './AudiosList';
import { AudioForm } from './AudioForm';

export default function AudiosAdmin() {
  const { data, loading, create, update, remove } = useCRUD(audios, {
    successMessages: {
      create: 'Áudio criado com sucesso!',
      update: 'Áudio atualizado com sucesso!',
      delete: 'Áudio excluído com sucesso!'
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

  if (loading && data.length === 0) {
    return <Loading text="Carregando áudios..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Áudios</h2>
          <p className="text-gray-600 mt-1">Gerir áudios do site</p>
        </div>
        <Button variant="primary" icon={<FaPlus />} onClick={() => open()}>
          Novo Áudio
        </Button>
      </div>

      <AudiosList audios={data} loading={loading} onEdit={(audio) => open(audio)} onDelete={remove} />

      <Modal isOpen={isOpen} onClose={close} title={editingItem ? 'Editar Áudio' : 'Novo Áudio'} size="lg">
        <AudioForm audio={editingItem} onSubmit={handleSubmit} onCancel={close} />
      </Modal>
    </div>
  );
}
