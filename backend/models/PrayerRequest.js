import mongoose from 'mongoose';

const PrayerRequestSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  telefone: { type: String, trim: true },
  tipo: {
    type: String,
    enum: ['oracao', 'aconselhamento', 'gratidao'],
    default: 'oracao'
  },
  pedido: { type: String, required: true, trim: true },
  privacidade: {
    type: String,
    enum: ['publico', 'pastoral'],
    default: 'publico'
  },
  anonimo: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['novo', 'em_oracao', 'respondido', 'arquivado'],
    default: 'novo'
  },
  contadorOracoes: { type: Number, default: 0 },
  respostaPastoral: { type: String, trim: true },
  respondidoEm: { type: Date }
}, {
  timestamps: true
});

PrayerRequestSchema.index({ privacidade: 1, status: 1, createdAt: -1 });

export default mongoose.model('PrayerRequest', PrayerRequestSchema);

