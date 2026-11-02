import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  telefone: String,
  assunto: { type: String, required: true },
  mensagem: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['novo', 'lido', 'respondido', 'arquivado'], 
    default: 'novo' 
  },
  resposta: String,
  respondidoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  respondidoEm: Date
}, { timestamps: true });

contactMessageSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
