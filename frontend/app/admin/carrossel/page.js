'use client';

import { FaPlus, FaImage } from 'react-icons/fa';
import { sections } from '@/lib/api';
import { useCRUD, useModal } from '@/hooks';
import { Button, Loading, Modal, Table, Badge } from '@/components/common';
import { CarrosselForm } from './CarrosselForm';
import useSiteStore from '@/store/useSiteStore';

export default function CarrosselAdmin() {
  const loadSlides = useSiteStore((s) => s.loadSlides);
  const { data, loading, create, update, remove } = useCRUD({
    getAll: () => sections.getAll('hero'),
    create: (data) => sections.create(data),
    update: (id, data) => sections.update(id, data),
    delete: (id) => sections.delete(id)
  }, {
    successMessages: {
      create: 'Slide criado com sucesso!',
      update: 'Slide atualizado com sucesso!',
      delete: 'Slide excluído com sucesso!'
    }
  });

  const { isOpen, open, close, editingItem } = useModal();

  const handleSubmit = async (idOrData, dataIfUpdate) => {
    if (dataIfUpdate) {
      await update(idOrData, dataIfUpdate);
    } else {
      await create(idOrData);
    }
    loadSlides(true);
  };

  const columns = [
    {
      header: 'Imagem',
      render: (row) =>
        row.imagem ? (
          <img
            src={row.imagem}
            alt={row.titulo}
            style={{ objectPosition: row.posicaoImagem || 'center' }}
            className="w-20 h-12 object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <span className="text-xs text-gray-400 italic">Gradiente</span>
        ),
    },
    { header: 'Título', accessor: 'titulo' },
    { header: 'Subtítulo', accessor: 'subtitulo' },
    { header: 'Ordem', accessor: 'ordem' },
    { 
      header: 'Status', 
      render: (row) => (
        <Badge variant={row.ativo ? 'success' : 'error'} size="sm">
          {row.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    }
  ];

  if (loading && data.length === 0) {
    return <Loading text="Carregando slides..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Carrossel / Hero</h2>
          <p className="text-gray-600 mt-1">Slides da página inicial</p>
        </div>
        <Button variant="primary" icon={<FaPlus />} onClick={() => open()}>
          Novo Slide
        </Button>
      </div>

      <Table
        columns={columns}
        data={data}
        onEdit={(item) => open(item)}
        onDelete={remove}
        emptyIcon={<FaImage />}
        emptyTitle="Nenhum slide"
        emptyDescription="Crie slides para o carrossel da página inicial"
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={editingItem ? 'Editar Slide' : 'Novo Slide'}
        size="lg"
      >
        <CarrosselForm
          slide={editingItem}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </Modal>
    </div>
  );
}
