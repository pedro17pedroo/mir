'use client';

import { FaPlus } from 'react-icons/fa';
import { videos } from '@/lib/api';
import { useCRUD, useModal } from '@/hooks';
import { Button, Loading, Modal } from '@/components/common';
import { VideosList } from './VideosList';
import { VideoForm } from './VideoForm';

export default function VideosAdmin() {
  const { data, loading, create, update, remove } = useCRUD(videos, {
    successMessages: {
      create: 'Vídeo criado com sucesso!',
      update: 'Vídeo atualizado com sucesso!',
      delete: 'Vídeo excluído com sucesso!'
    }
  });

  const { isOpen, open, close, editingItem } = useModal();

  const handleEdit = (video) => {
    open(video);
  };

  const handleSubmit = async (idOrData, dataIfUpdate) => {
    if (dataIfUpdate) {
      await update(idOrData, dataIfUpdate);
    } else {
      await create(idOrData);
    }
  };

  if (loading && data.length === 0) {
    return <Loading text="Carregando vídeos..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Vídeos</h2>
          <p className="text-gray-600 mt-1">Gerir vídeos do site</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={() => open()}
        >
          Novo Vídeo
        </Button>
      </div>

      {/* Lista de Vídeos */}
      <VideosList
        videos={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={remove}
      />

      {/* Modal de Formulário */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        title={editingItem ? 'Editar Vídeo' : 'Novo Vídeo'}
        size="lg"
      >
        <VideoForm
          video={editingItem}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </Modal>
    </div>
  );
}
