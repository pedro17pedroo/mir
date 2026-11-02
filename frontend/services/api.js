// Este arquivo foi consolidado em frontend/lib/api.js
// Mantendo exports para compatibilidade retroativa

import api, { menus, theme, sections } from '../lib/api.js';

// Funções legadas para compatibilidade
export const fetchMenus = async () => {
  const response = await menus.getAll();
  return response.data;
};

export const fetchTheme = async () => {
  const response = await theme.get();
  return response.data;
};

export const fetchSections = async (tipo) => {
  const response = await sections.getAll(tipo);
  return response.data;
};

// Export default da instância do axios
export default api;
