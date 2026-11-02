'use client';

import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Badge, EmptyState } from '@/components/common';

/**
 * Componente Table genérico e reutilizável
 * @param {Array} columns - Definição das colunas
 * @param {Array} data - Dados da tabela
 * @param {Function} onEdit - Callback para editar
 * @param {Function} onDelete - Callback para deletar
 * @param {React.ReactNode} emptyIcon - Ícone para estado vazio
 * @param {string} emptyTitle - Título para estado vazio
 * @param {string} emptyDescription - Descrição para estado vazio
 */
export const Table = ({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  emptyIcon,
  emptyTitle = 'Nenhum registro encontrado',
  emptyDescription = '',
  loading = false
}) => {
  if (loading) {
    return null;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={row._id || rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap ${
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {column.render ? column.render(row) : (
                    <div className={`text-sm ${column.className || 'text-gray-900'}`}>
                      {row[column.accessor]}
                    </div>
                  )}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<FaEdit />}
                        onClick={() => onEdit(row)}
                        className="p-2"
                      />
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<FaTrash />}
                        onClick={() => onDelete(row._id)}
                        className="p-2 text-red-600 hover:bg-red-50"
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
