'use client';

import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaFileAlt } from 'react-icons/fa';
import { Badge, Button, EmptyState } from '@/components/common';

export const PaginasTable = ({ paginas, loading, onEdit, onDelete, onToggleStatus }) => {
  if (loading) {
    return null;
  }

  if (paginas.length === 0) {
    return (
      <EmptyState
        icon={<FaFileAlt />}
        title="Nenhuma página cadastrada"
        description="Comece criando sua primeira página com o editor visual"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug (URL)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginas.map((pagina) => (
            <tr key={pagina._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{pagina.titulo}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">/{pagina.slug}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggleStatus(pagina)}
                  className="focus:outline-none"
                >
                  <Badge 
                    variant={pagina.ativa ? 'success' : 'error'} 
                    size="sm"
                    icon={pagina.ativa ? <FaEye /> : <FaEyeSlash />}
                  >
                    {pagina.ativa ? 'Ativa' : 'Inativa'}
                  </Badge>
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FaEdit />}
                    onClick={() => onEdit(pagina)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FaTrash />}
                    onClick={() => onDelete(pagina._id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
