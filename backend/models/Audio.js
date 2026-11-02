import mongoose from 'mongoose';

const AudioSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  descricao: { type: String },
  thumbnail: { type: String },
  
  // URL do áudio
  audioUrl: { type: String, required: true },
  
  // Metadados
  duracao: { type: String }, // Ex: "45:30"
  pregador: { type: String },
  categoria: { 
    type: String,
    enum: ['pregacao', 'ensino', 'devocional', 'podcast', 'outro'],
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
  reproducoes: { type: Number, default: 0 }
}, { timestamps: true });

// Middleware para criar slug
AudioSchema.pre('save', function(next) {
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

AudioSchema.index({ status: 1, categoria: 1, destaque: -1, dataPublicacao: -1, ordem: 1 });

export default mongoose.model('Audio', AudioSchema);
