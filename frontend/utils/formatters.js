/**
 * Utilitários de formatação
 */

/**
 * Formata data para pt-BR
 * @param {string|Date} date - Data a ser formatada
 * @param {object} options - Opções de formatação
 * @returns {string} Data formatada
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';
  
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('pt-BR', defaultOptions);
};

/**
 * Formata data e hora para pt-BR
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data e hora formatadas
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formata valor monetário para AOA
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'AOA 0,00';
  
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2
  });
};

/**
 * Trunca texto com reticências
 * @param {string} text - Texto a ser truncado
 * @param {number} length - Comprimento máximo
 * @returns {string} Texto truncado
 */
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Formata telefone
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');
  
  // Formata conforme o tamanho
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

/**
 * Formata slug (URL amigável)
 * @param {string} text - Texto a ser convertido em slug
 * @returns {string} Slug formatado
 */
export const formatSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
};

/**
 * Capitaliza primeira letra
 * @param {string} text - Texto
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formata número com separador de milhares
 * @param {number} num - Número
 * @returns {string} Número formatado
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('pt-BR');
};
