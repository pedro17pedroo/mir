import mongoose from 'mongoose';

const AvisoSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  conteudo: { type: String, required: true, trim: true },
  categoria: {
    type: String,
    enum: ['geral', 'urgente', 'jejum_oracao', 'departamento', 'agenda'],
    default: 'geral'
  },
  dataExpiracao: { type: Date },
  fixado: { type: Boolean, default: false },
  ativo: { type: Boolean, default: true }
}, {
  timestamps: true
});

AvisoSchema.index({ ativo: 1, fixado: -1, createdAt: -1 });

export default mongoose.model('Aviso', AvisoSchema);

