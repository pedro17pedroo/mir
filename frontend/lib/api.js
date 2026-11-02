import axios from 'axios';

// Função para obter a URL base correta dependendo do ambiente
const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
        } catch (error) {
          console.error('Erro ao parsear auth-storage:', error);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        window.location.href = '/admin/login';
      }
      
      const errorMessage = data?.message || data?.mensagem || 'Erro ao processar requisição';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      console.error('Erro de conexão:', error.message);
      return Promise.reject(new Error('Erro de conexão com o servidor'));
    } else {
      console.error('Erro desconhecido:', error.message);
      return Promise.reject(error);
    }
  }
);

// Autenticação e Gestão de Utilizadores
export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password) => api.post('/auth/register', { email, password }),
  registerUser: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

// Menus
export const menus = {
  getAll: () => api.get('/menus'),
  getHierarchy: () => api.get('/menus'),
  getById: (id) => api.get(`/menus/${id}`),
  create: (data) => api.post('/menus', data),
  update: (id, data) => api.put(`/menus/${id}`, data),
  delete: (id) => api.delete(`/menus/${id}`),
};

// Temas
export const theme = {
  get: () => api.get('/theme'),
  update: (data) => api.put('/theme', data),
};

// Seções
export const sections = {
  getAll: (tipo) => api.get('/sections', { params: { tipo } }),
  getById: (id) => api.get(`/sections/${id}`),
  create: (data) => api.post('/sections', data),
  update: (id, data) => api.put(`/sections/${id}`, data),
  delete: (id) => api.delete(`/sections/${id}`),
};

// Páginas
export const pages = {
  getAll: (params) => api.get('/paginas', { params }),
  getById: (id) => api.get(`/paginas/${id}`),
  getBySlug: (slug) => api.get(`/paginas/slug/${slug}`),
  create: (data) => api.post('/paginas', data),
  update: (id, data) => api.put(`/paginas/${id}`, data),
  delete: (id) => api.delete(`/paginas/${id}`),
  updateOrder: (paginas) => api.patch('/paginas/ordem', { paginas }),
};
export const paginas = pages;

// Doações / Dízimos e Ofertas
export const donations = {
  getAll: () => api.get('/donations'),
  getById: (id) => api.get(`/donations/${id}`),
  create: (data) => api.post('/donations', data),
  updateStatus: (id, status) => api.put(`/donations/${id}/status`, { status }),
  delete: (id) => api.delete(`/donations/${id}`),
};

// Livestreams
export const livestreams = {
  getAll: () => api.get('/livestreams'),
  getActive: () => api.get('/livestreams/active'),
  getById: (id) => api.get(`/livestreams/${id}`),
  create: (data) => api.post('/livestreams', data),
  update: (id, data) => api.put(`/livestreams/${id}`, data),
  delete: (id) => api.delete(`/livestreams/${id}`),
};

// Newsletters
export const newsletters = {
  subscribe: (email) => api.post('/newsletters/subscribe', { email }),
  getAll: () => api.get('/newsletters'),
  send: (data) => api.post('/newsletters/send', data),
  delete: (id) => api.delete(`/newsletters/${id}`),
};

// Testemunhos
export const testemunhos = {
  getAll: () => api.get('/testemunhos'),
  getById: (id) => api.get(`/testemunhos/${id}`),
  create: (data) => api.post('/testemunhos', data),
  enviarPublico: (data) => api.post('/testemunhos/publico', data),
  update: (id, data) => api.put(`/testemunhos/${id}`, data),
  delete: (id) => api.delete(`/testemunhos/${id}`),
};

// Visitantes e Novos Convertidos
export const visitantes = {
  getAll: (params) => api.get('/visitantes', { params }),
  create: (data) => api.post('/visitantes', data),
  update: (id, data) => api.put(`/visitantes/${id}`, data),
  converterMembro: (id) => api.post(`/visitantes/${id}/converter-membro`),
  delete: (id) => api.delete(`/visitantes/${id}`),
};

// Escalas de Obreiros
export const escalas = {
  getAll: (params) => api.get('/escalas', { params }),
  create: (data) => api.post('/escalas', data),
  update: (id, data) => api.put(`/escalas/${id}`, data),
  delete: (id) => api.delete(`/escalas/${id}`),
};

// Escola Bíblica e Cursos
export const cursos = {
  getAll: (params) => api.get('/cursos', { params }),
  create: (data) => api.post('/cursos', data),
  update: (id, data) => api.put(`/cursos/${id}`, data),
  delete: (id) => api.delete(`/cursos/${id}`),
  matricular: (id, data) => api.post(`/cursos/${id}/matricular`, data),
  removerAluno: (id, alunoId) => api.delete(`/cursos/${id}/alunos/${alunoId}`),
};

// Mural de Avisos
export const avisos = {
  getAll: (params) => api.get('/avisos', { params }),
  create: (data) => api.post('/avisos', data),
  update: (id, data) => api.put(`/avisos/${id}`, data),
  delete: (id) => api.delete(`/avisos/${id}`),
};

// Eventos
export const eventos = {
  getAll: () => api.get('/eventos'),
  getById: (id) => api.get(`/eventos/${id}`),
  create: (data) => api.post('/eventos', data),
  update: (id, data) => api.put(`/eventos/${id}`, data),
  delete: (id) => api.delete(`/eventos/${id}`),
  inscrever: (id, data) => api.post(`/eventos/${id}/inscrever`, data),
  removerInscrito: (id, inscritoId) => api.delete(`/eventos/${id}/inscritos/${inscritoId}`),
};

// Mensagens
export const mensagens = {
  getAll: () => api.get('/mensagens'),
  getById: (id) => api.get(`/mensagens/${id}`),
  create: (data) => api.post('/mensagens', data),
  update: (id, data) => api.put(`/mensagens/${id}`, data),
  delete: (id) => api.delete(`/mensagens/${id}`),
};

// Membros
export const membros = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

// Ministérios e Células
export const ministerios = {
  getAll: (params) => api.get('/ministerios', { params }),
  getById: (id) => api.get(`/ministerios/${id}`),
  create: (data) => api.post('/ministerios', data),
  update: (id, data) => api.put(`/ministerios/${id}`, data),
  delete: (id) => api.delete(`/ministerios/${id}`),
  inscrever: (id, data) => api.post(`/ministerios/${id}/inscrever`, data),
  removerInteressado: (id, interessadoId) =>
    api.delete(`/ministerios/${id}/interessados/${interessadoId}`),
  adicionarRelatorio: (id, data) => api.post(`/ministerios/${id}/relatorios`, data),
  removerRelatorio: (id, relatorioId) =>
    api.delete(`/ministerios/${id}/relatorios/${relatorioId}`),
};

// Galeria de Fotos e Álbuns
export const galeria = {
  getPublic: (params) => api.get('/galeria', { params }),
  getAllAdmin: () => api.get('/galeria/admin'),
  getById: (id) => api.get(`/galeria/${id}`),
  create: (data) => api.post('/galeria', data),
  update: (id, data) => api.put(`/galeria/${id}`, data),
  delete: (id) => api.delete(`/galeria/${id}`),
};

// Património e Inventário
export const patrimonio = {
  getAll: () => api.get('/patrimonio'),
  create: (data) => api.post('/patrimonio', data),
  update: (id, data) => api.put(`/patrimonio/${id}`, data),
  delete: (id) => api.delete(`/patrimonio/${id}`),
};

// Backup do Sistema
export const backup = {
  exportarJSON: () => api.get('/backup'),
};

// Pedidos de Oração e Aconselhamento
export const oracoes = {
  getPublicas: () => api.get('/oracoes/publicas'),
  getAll: (params) => api.get('/oracoes', { params }),
  create: (data) => api.post('/oracoes', data),
  orar: (id) => api.post(`/oracoes/${id}/orar`),
  update: (id, data) => api.put(`/oracoes/${id}`, data),
  delete: (id) => api.delete(`/oracoes/${id}`),
};

// Vídeos
export const videos = {
  getAll: (params) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  getBySlug: (slug) => api.get(`/videos/slug/${slug}`),
  create: (data) => api.post('/videos', data),
  update: (id, data) => api.put(`/videos/${id}`, data),
  delete: (id) => api.delete(`/videos/${id}`),
};

// Áudios
export const audios = {
  getAll: (params) => api.get('/audios', { params }),
  getById: (id) => api.get(`/audios/${id}`),
  getBySlug: (slug) => api.get(`/audios/slug/${slug}`),
  create: (data) => api.post('/audios', data),
  update: (id, data) => api.put(`/audios/${id}`, data),
  delete: (id) => api.delete(`/audios/${id}`),
};

// Sobre o Pastor
export const sobrePastor = {
  get: () => api.get('/sobre-pastor'),
  save: (data) => api.post('/sobre-pastor', data),
};

// Serviços
export const servicos = {
  get: () => api.get('/servicos'),
  save: (data) => api.post('/servicos', data),
};

// Contact
export const contact = {
  getInfo: () => api.get('/contact/info'),
  updateInfo: (data) => api.put('/contact/info', data),
  getMessages: () => api.get('/contact/messages'),
  sendMessage: (data) => api.post('/contact/messages', data),
  markAsRead: (id) => api.patch(`/contact/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/messages/${id}`)
};

export default api;
