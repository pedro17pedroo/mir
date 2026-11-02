import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  slug: { 
    type: String, 
    required: [true, 'O slug é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+(\/[a-z0-9-]+)*$/, 'Use apenas letras minúsculas, números, hífens e barras']
  },
  conteudo: { 
    type: String, 
    required: [true, 'O conteúdo é obrigatório'] 
  },
  metaDescricao: { 
    type: String, 
    maxlength: [160, 'A meta descrição não pode ter mais que 160 caracteres'],
    trim: true
  },
  corFundo: {
    type: String,
    default: null // null = usar cor padrão do tema
  },
  usarCorPadrao: {
    type: Boolean,
    default: true
  },
  imagemHero: {
    type: String,
    default: '' // vazio = usa heroPaginasImagem do tema
  },
  posicaoImagemHero: {
    type: String,
    default: 'center'
  },
  alturaHero: {
    type: String,
    default: '' // vazio = usa heroPaginasAltura do tema
  },
  corTexto: {
    type: String,
    default: '' // vazio = usa corTexto do tema
  },
  fonteTitulo: {
    type: String,
    default: '' // vazio = usa fonteTitulos do tema
  },
  larguraConteudo: {
    type: String,
    default: 'normal' // narrow (4xl), normal (7xl), full (100%)
  },
  mostrarHero: {
    type: Boolean,
    default: true
  },
  mostrarCta: {
    type: Boolean,
    default: true
  },
  ativa: { 
    type: Boolean, 
    default: true 
  },
  status: {
    type: String,
    enum: ['publicado', 'rascunho'],
    default: 'publicado'
  },
  destaque: {
    type: Boolean,
    default: false
  },
  menu: { 
    type: Boolean, 
    default: false 
  },
  ordemMenu: { 
    type: Number, 
    default: 0 
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  atualizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índice para busca por texto
PageSchema.index({ 
  titulo: 'text', 
  conteudo: 'text',
  metaDescricao: 'text' 
});

// Middleware para criar slug a partir do título se não fornecido e sincronizar status/ativa
PageSchema.pre('validate', function(next) {
  if (!this.slug && this.titulo) {
    this.slug = this.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s/-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
      .replace(/^[-/]+|[-/]+$/g, '');
  } else if (this.slug) {
    this.slug = this.slug.replace(/^\/+|\/+$/g, '');
  }

  if (this.isModified('status') && !this.isModified('ativa')) {
    this.ativa = this.status === 'publicado';
  } else if (this.isModified('ativa') && !this.isModified('status')) {
    this.status = this.ativa ? 'publicado' : 'rascunho';
  }
  next();
});

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
