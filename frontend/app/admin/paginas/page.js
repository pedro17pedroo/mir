'use client';

import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { pages } from '@/lib/api';
import { useCRUD } from '@/hooks';
import { Button, Loading } from '@/components/common';
import { PaginasTable } from './PaginasTable';

export default function PaginasAdmin() {
  const router = useRouter();
  const { data, loading, update, remove } = useCRUD(pages, {
    successMessages: {
      update: 'Página atualizada com sucesso!',
      delete: 'Página excluída com sucesso!'
    }
  });

  const handleEdit = (pagina) => {
    router.push(`/admin/paginas/editar/${pagina._id}`);
  };

  const handleNew = () => {
    router.push('/admin/paginas/nova');
  };

  const handleToggleStatus = async (pagina) => {
    try {
      await update(pagina._id, { ativa: !pagina.ativa });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (loading && data.length === 0) {
    return <Loading text="Carregando páginas..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Páginas</h2>
          <p className="text-gray-600 mt-1">Gerir páginas do site com editor visual</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={handleNew}
        >
          Nova Página
        </Button>
      </div>

      <PaginasTable
        paginas={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={remove}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
