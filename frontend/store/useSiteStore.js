import { create } from 'zustand';
import api, { menus, theme, sections, eventos as eventosApi, testemunhos as testemunhosApi, servicos as servicosApi } from '@/lib/api';

const useSiteStore = create((set, get) => ({
  theme: {
    corPrimaria: '#FFC107',
    corSecundaria: '#6D28D9',
    dropdownCorFundo: '#ffffff',
    dropdownCorTexto: '#1f2937',
    dropdownCorTextoHover: '#9333ea',
    dropdownCorFundoHover: '#f5f3ff',
    dropdownCorBorda: '#e5e7eb',
    dropdownBorda: true,
    dropdownSombra: true,
    dropdownFonteTamanho: 'normal',
    dropdownArredondamento: 'medium',
    dropdownLargura: 'normal'
  },
  themeLoaded: false,
  setTheme: (themeData) => set({ theme: themeData, themeLoaded: true }),

  user: null,
  setUser: (user) => set({ user }),

  menus: [],
  menusLoaded: false,
  setMenus: (menusData) => set({ menus: menusData, menusLoaded: true }),

  slides: [],
  setSlides: (slides) => set({ slides }),

  // Estados globais para outros dados
  eventos: [],
  setEventos: (eventos) => set({ eventos }),
  servicos: [],
  setServicos: (servicos) => set({ servicos }),
  testemunhos: [],
  setTestemunhos: (testemunhos) => set({ testemunhos }),
  contactInfo: null,
  setContactInfo: (contactInfo) => set({ contactInfo }),

  // Estados de loading e erro
  loading: false,
  error: null,

  // Métodos assíncronos centralizados
  loadMenus: async (force = false) => {
    if (get().menusLoaded && !force) return;
    try {
      set({ loading: true, error: null });
      const response = await menus.getAll();
      set({ menus: response.data || [], menusLoaded: true, loading: false });
    } catch (error) {
      console.error('Erro ao carregar menus:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  loadTheme: async (force = false) => {
    if (get().themeLoaded && !force) return;
    try {
      set({ loading: true, error: null });
      const response = await theme.get();
      if (response.data) {
        set({ theme: response.data, themeLoaded: true, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  loadSlides: async () => {
    try {
      set({ loading: true, error: null });
      const response = await sections.getAll('carrossel');
      set({ slides: response.data || [], loading: false });
    } catch (error) {
      console.error('Erro ao carregar slides:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  loadEventos: async () => {
    try {
      set({ loading: true, error: null });
      const response = await eventosApi.getAll();
      set({ eventos: response.data || [], loading: false });
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  loadServicos: async () => {
    try {
      set({ loading: true, error: null });
      const response = await servicosApi.get();
      set({ servicos: response.data?.servicos || response.data || [], loading: false });
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  loadTestemunhos: async () => {
    try {
      set({ loading: true, error: null });
      const response = await testemunhosApi.getAll();
      set({ testemunhos: response.data || [], loading: false });
    } catch (error) {
      console.error('Erro ao carregar testemunhos:', error);
      set({ error: error.message, loading: false });
    }
  },

  loadContactInfo: async (force = false) => {
    if (get().contactInfo && !force) return;
    try {
      const response = await api.get('/contact/info');
      set({ contactInfo: response.data });
    } catch (error) {
      console.error('Erro ao carregar informações de contato:', error);
    }
  },

  // Limpar erro
  clearError: () => set({ error: null }),
}));

export default useSiteStore;
