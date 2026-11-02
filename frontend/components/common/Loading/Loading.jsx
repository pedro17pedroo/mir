import React from 'react';

/**
 * Componente Loading reutilizável
 * @param {string} size - sm, md, lg, xl
 * @param {string} text - Texto opcional abaixo do spinner
 * @param {boolean} fullScreen - Se true, ocupa tela inteira
 */
export const Loading = ({ 
  size = 'md', 
  text = '', 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-purple-600 ${sizeClasses[size]} mx-auto`}></div>
        {text && (
          <p className="mt-4 text-gray-600 text-sm">{text}</p>
        )}
      </div>
    </div>
  );
};
