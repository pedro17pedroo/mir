import mongoose from 'mongoose';

const InteressadoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  telefone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  mensagem: { type: String, trim: true },
  status: { type: String, enum: ['pendente', 'contatado', 'integrado'], default: 'pendente' },
  data: { type: Date, default: Date.now }
});

const RelatorioReuniaoSchema = new mongoose.Schema({
  data: { type: Date, default: Date.now },
  presentes: { type: Number, default: 0 },
  visitantes: { type: Number, default: 0 },
  decisoes: { type: Number, default: 0 },
  oferta: { type: Number, default: 0 },
  tema: { type: String, trim: true, default: '' },
  observacoes: { type: String, trim: true, default: '' }
});

const MinisterioSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true },
  tipo: {
    type: String,
    enum: ['ministerio', 'celula'],
    default: 'ministerio'
  },
  descricao: { type: String, required: true, trim: true },
  missao: { type: String, trim: true },
  lider: { type: String, trim: true },
  cargoLider: { type: String, default: 'Líder', trim: true },
  telefoneContato: { type: String, trim: true },
  emailContato: { type: String, trim: true },
  diaReuniao: { type: String, trim: true },
  horarioReuniao: { type: String, trim: true },
  local: { type: String, trim: true },
  bairro: { type: String, trim: true },
  imagem: { type: String },
  cor: { type: String, default: '#7c3aed' },
  ordem: { type: Number, default: 0 },
  ativo: { type: Boolean, default: true },
  interessados: [InteressadoSchema],
  relatorios: [RelatorioReuniaoSchema]
}, {
  timestamps: true
});

MinisterioSchema.index({ tipo: 1, ativo: 1, ordem: 1 });

MinisterioSchema.pre('validate', function(next) {
  if (this.nome && !this.slug) {
    this.slug = this.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Ministerio', MinisterioSchema);

