import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { auth as authApi } from '@/lib/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,
      error: null,
      
      // Inicializa o estado de autenticação
      initialize: async () => {
        const state = get();
        const token = state.token;
        
        console.log('🔐 Inicializando autenticação...', { hasToken: !!token, isAuthenticated: state.isAuthenticated });
        
        if (!token) {
          set({ loading: false, isAuthenticated: false, user: null });
          return;
        }
        
        set({ loading: true, error: null });
        
        try {
          const response = await authApi.getMe();
          console.log('✅ Autenticação validada:', response.data);
          set({
            user: response.data,
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } catch (error) {
          console.error('❌ Erro ao inicializar autenticação:', error);
          // Se o token for inválido, limpa tudo
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            loading: false,
            error: null
          });
        }
      },
      
      // Login do usuário
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          const { user, token } = response.data;
          
          console.log('✅ Login bem-sucedido:', { user: user.email, hasToken: !!token });
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            loading: false,
            error: null 
          });
          
          return { success: true };
        } catch (error) {
          console.error('❌ Erro ao fazer login:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
          set({ 
            loading: false, 
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },
      
      // Logout do usuário
      logout: async () => {
        set({ loading: true });
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        } finally {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            loading: false,
            error: null 
          });
        }
      },
      
      // Limpa erro
      clearError: () => set({ error: null }),
      
      // Atualiza os dados do usuário
      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;
