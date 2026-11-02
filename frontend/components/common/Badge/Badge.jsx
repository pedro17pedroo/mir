import React from 'react';

/**
 * Componente Badge reutilizável
 * @param {string} variant - success, error, warning, info, default
 * @param {string} size - sm, md, lg
 * @param {React.ReactNode} icon - Ícone opcional
 * @param {React.ReactNode} children - Conteúdo do badge
 */
export const Badge = ({
  variant = 'default',
  size = 'md',
  icon = null,
  children,
  className = ''
}) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};
