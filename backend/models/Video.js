import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  descricao: { type: String },
  thumbnail: { type: String },
  
  // Tipo de vídeo
  tipoVideo: { 
    type: String, 
    enum: ['youtube', 'vimeo', 'upload'],
    required: true 
  },
  
  // URLs ou IDs
  youtubeId: { type: String }, // ID do vídeo do YouTube
  vimeoId: { type: String }, // ID do vídeo do Vimeo
  videoUrl: { type: String }, // URL do vídeo hospedado
  
  // Metadados
  duracao: { type: String }, // Ex: "45:30"
  pregador: { type: String },
  categoria: { 
    type: String,
    enum: ['pregacao', 'ensino', 'louvor', 'testemunho', 'evento', 'outro'],
    default: 'pregacao'
  },
  tags: [{ type: String }],
  
  // Data
  dataPublicacao: { type: Date, default: Date.now },
  
  // Organização
  destaque: { type: Boolean, default: false },
  ordem: { type: Number, default: 0 },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  
  // Estatísticas
  visualizacoes: { type: Number, default: 0 }
}, { timestamps: true });

// Middleware para criar slug
VideoSchema.pre('save', function(next) {
  if (!this.slug && this.titulo) {
    this.slug = this.titulo
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '');
  }
  next();
});

VideoSchema.index({ status: 1, categoria: 1, destaque: -1, dataPublicacao: -1, ordem: 1 });

export default mongoose.model('Video', VideoSchema);
