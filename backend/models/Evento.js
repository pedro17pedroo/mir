import mongoose from 'mongoose';

const InscritoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  telefone: { type: String, required: true, trim: true },
  acompanhantes: { type: Number, default: 0, min: 0 },
  observacoes: { type: String, trim: true },
  dataInscricao: { type: Date, default: Date.now }
});

const EventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  descricao: { type: String },
  imagem: { type: String },
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date },
  horarioInicio: { type: String }, // Ex: "19:00"
  horarioFim: { type: String },
  local: { type: String },
  localizacao: {
    latitude: { type: Number },
    longitude: { type: Number },
    endereco: { type: String }
  },
  organizador: { type: String },
  capacidade: { type: Number, default: 0 }, // 0 = ilimitado
  preco: { type: Number, default: 0 }, // 0 = gratuito
  inscricaoAberta: { type: Boolean, default: true },
  inscritos: [InscritoSchema],
  destaque: { type: Boolean, default: false },
  ordem: { type: Number },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' }
}, { timestamps: true });

// Middleware para criar slug a partir do título se não fornecido
EventoSchema.pre('save', function(next) {
  if (!this.slug && this.titulo) {
    this.slug = this.titulo
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^\w\s-]/g, '') // remove caracteres especiais
      .replace(/\s+/g, '-') // substitui espaços por hífens
      .replace(/--+/g, '-') // substitui múltiplos hífens por um único
      .trim()
      .replace(/^-+|-+$/g, ''); // remove hífens do início e do fim
  }
  next();
});

EventoSchema.index({ status: 1, dataInicio: 1, ordem: 1 });

export default mongoose.model('Evento', EventoSchema);
