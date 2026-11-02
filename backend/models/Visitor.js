import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  telefone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  bairro: { type: String, trim: true },
  faixaEtaria: {
    type: String,
    enum: ['crianca', 'adolescente', 'jovem', 'adulto', 'idoso'],
    default: 'adulto'
  },
  tipoVisita: {
    type: String,
    enum: ['primeira_vez', 'novo_convertido', 'reconciliacao', 'mudanca_igreja'],
    default: 'primeira_vez'
  },
  comoConheceu: { type: String, trim: true },
  desejaVisitaPastoral: { type: Boolean, default: false },
  desejaCelula: { type: Boolean, default: true },
  desejaBatismo: { type: Boolean, default: false },
  observacoes: { type: String, trim: true },
  notasAcompanhamento: { type: String, trim: true },
  responsavelConsolidacao: { type: String, trim: true },
  statusConsolidacao: {
    type: String,
    enum: ['novo', 'contatado', 'em_discipulado', 'integrado', 'arquivado'],
    default: 'novo'
  },
  dataVisita: { type: Date, default: Date.now }
}, {
  timestamps: true
});

VisitorSchema.index({ statusConsolidacao: 1, createdAt: -1 });

export default mongoose.model('Visitor', VisitorSchema);

