import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  natureza: {
    type: String,
    enum: ['entrada', 'saida'],
    default: 'entrada'
  },
  valor: { type: Number, required: true },
  data: { type: Date, default: Date.now },
  tipoContribuicao: {
    type: String,
    enum: ['dizimo', 'oferta', 'missoes', 'construcao', 'outro'],
    default: 'dizimo'
  },
  categoriaDespesa: {
    type: String,
    enum: [
      '',
      'energia_agua',
      'renda_instalacoes',
      'som_midia',
      'acao_social',
      'manutencao',
      'subsidios_pessoal',
      'eventos_cultos',
      'missoes',
      'outro'
    ],
    default: ''
  },
  beneficiario: { type: String, trim: true, default: '' },
  metodoPagamento: { 
    type: String, 
    enum: ['cartao', 'multicaixa', 'Multicaixa', 'transferencia', 'dinheiro'], 
    required: true 
  },
  referenciaComprovativo: { type: String, trim: true },
  observacoes: { type: String, trim: true },
  doador: {
    nome: { type: String },
    email: { type: String },
    telefone: { type: String },
    anonimo: { type: Boolean, default: false }
  },
  status: { type: String, enum: ['pendente', 'concluido', 'falhou'], default: 'pendente' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

DonationSchema.virtual('metodo').get(function() {
  return this.metodoPagamento;
});

DonationSchema.virtual('nome').get(function() {
  return this.doador?.nome;
});

DonationSchema.virtual('email').get(function() {
  return this.doador?.email;
});

export default mongoose.model('Donation', DonationSchema);
