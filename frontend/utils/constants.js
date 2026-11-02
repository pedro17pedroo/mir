/**
 * Constantes da aplicação
 */

// Cores do tema
export const COLORS = {
  primary: '#9333ea',
  primaryHover: '#7e22ce',
  secondary: '#ec4899',
  secondaryHover: '#db2777',
  success: '#10b981',
  successHover: '#059669',
  error: '#ef4444',
  errorHover: '#dc2626',
  warning: '#f59e0b',
  warningHover: '#d97706',
  info: '#3b82f6',
  infoHover: '#2563eb',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

// Breakpoints responsivos
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Tamanhos
export const SIZES = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
  xl: 'extra-large'
};

// Status
export const STATUS = {
  ACTIVE: 'ativo',
  INACTIVE: 'inativo',
  PENDING: 'pendente',
  APPROVED: 'aprovado',
  REJECTED: 'rejeitado'
};

// Variantes de componentes
export const VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  ghost: 'ghost'
};

// Mensagens padrão
export const MESSAGES = {
  success: {
    create: 'Criado com sucesso!',
    update: 'Atualizado com sucesso!',
    delete: 'Excluído com sucesso!',
    save: 'Salvo com sucesso!'
  },
  error: {
    generic: 'Ocorreu um erro. Tente novamente.',
    network: 'Erro de conexão. Verifique sua internet.',
    notFound: 'Não encontrado.',
    unauthorized: 'Você não tem permissão para esta ação.',
    validation: 'Verifique os campos e tente novamente.'
  },
  confirm: {
    delete: 'Tem certeza que deseja excluir?',
    leave: 'Tem certeza que deseja sair? Alterações não salvas serão perdidas.'
  }
};

// Configurações de paginação
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100]
};

// Timeouts
export const TIMEOUTS = {
  toast: 3000,
  debounce: 500,
  apiRequest: 10000
};

// Formatos de data
export const DATE_FORMATS = {
  short: 'dd/MM/yyyy',
  long: 'dd/MM/yyyy HH:mm',
  full: 'dd/MM/yyyy HH:mm:ss'
};

// Roles de usuário
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

// Tipos de conteúdo
export const CONTENT_TYPES = {
  PAGE: 'page',
  POST: 'post',
  EVENT: 'event',
  TESTIMONY: 'testimony'
};
