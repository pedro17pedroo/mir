import React from 'react';

/**
 * Componente EmptyState reutilizável
 * @param {React.ReactNode} icon - Ícone (componente React)
 * @param {string} title - Título
 * @param {string} description - Descrição opcional
 * @param {React.ReactNode} action - Botão de ação opcional
 */
export const EmptyState = ({
  icon,
  title,
  description = '',
  action = null,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-4 bg-white rounded-lg shadow ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4 text-gray-400 text-5xl">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};
