/**
 * Utilitários de validação
 */

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} Se é válido
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida campo obrigatório
 * @param {any} value - Valor a ser validado
 * @returns {boolean} Se é válido
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Valida comprimento mínimo
 * @param {string} value - Valor a ser validado
 * @param {number} min - Comprimento mínimo
 * @returns {boolean} Se é válido
 */
export const validateMinLength = (value, min) => {
  if (!value) return false;
  return value.length >= min;
};

/**
 * Valida comprimento máximo
 * @param {string} value - Valor a ser validado
 * @param {number} max - Comprimento máximo
 * @returns {boolean} Se é válido
 */
export const validateMaxLength = (value, max) => {
  if (!value) return true;
  return value.length <= max;
};

/**
 * Valida URL
 * @param {string} url - URL a ser validada
 * @returns {boolean} Se é válida
 */
export const validateURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida telefone (formato Angola)
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} Se é válido
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 9;
};

/**
 * Valida número
 * @param {any} value - Valor a ser validado
 * @returns {boolean} Se é número válido
 */
export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Valida número positivo
 * @param {any} value - Valor a ser validado
 * @returns {boolean} Se é número positivo
 */
export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

/**
 * Valida data
 * @param {string} date - Data a ser validada
 * @returns {boolean} Se é data válida
 */
export const validateDate = (date) => {
  if (!date) return false;
  const parsed = new Date(date);
  return parsed instanceof Date && !isNaN(parsed);
};

/**
 * Valida se data é futura
 * @param {string} date - Data a ser validada
 * @returns {boolean} Se é data futura
 */
export const validateFutureDate = (date) => {
  if (!validateDate(date)) return false;
  return new Date(date) > new Date();
};

/**
 * Valida slug (URL amigável)
 * @param {string} slug - Slug a ser validado
 * @returns {boolean} Se é slug válido
 */
export const validateSlug = (slug) => {
  if (!slug) return false;
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return regex.test(slug);
};
