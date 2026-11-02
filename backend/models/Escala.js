import mongoose from 'mongoose';

const EscaladoSchema = new mongoose.Schema({
  funcao: { type: String, required: true, trim: true }, // Ex: Pregador, Dirigente, Louvor, Recepção, Mídia, Infantil
  nome: { type: String, required: true, trim: true },
  telefone: { type: String, trim: true },
  confirmado: { type: Boolean, default: true }
});

const EscalaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true }, // Ex: Culto de Celebração Dominical
  dataCulto: { type: Date, required: true },
  horario: { type: String, default: '09:00', trim: true },
  local: { type: String, default: 'Templo Principal', trim: true },
  pregador: { type: String, trim: true },
  dirigente: { type: String, trim: true },
  observacoes: { type: String, trim: true },
  equipa: [EscaladoSchema],
  publicada: { type: Boolean, default: true }
}, {
  timestamps: true
});

EscalaSchema.index({ dataCulto: 1, publicada: 1 });

export default mongoose.model('Escala', EscalaSchema);

