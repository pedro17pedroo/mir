import mongoose from 'mongoose';

const TestemunhoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  telefone: { type: String, trim: true },
  local: { type: String, default: '', trim: true },
  mensagem: { type: String },
  texto: { type: String },
  foto: { type: String },
  ordem: { type: Number, default: 0 },
  ativo: { type: Boolean, default: true },
  status: { type: String, enum: ['ativo', 'inativo', 'pendente'], default: 'ativo' }
}, { timestamps: true });

TestemunhoSchema.pre('validate', function(next) {
  if (this.texto && !this.mensagem) {
    this.mensagem = this.texto;
  } else if (this.mensagem && !this.texto) {
    this.texto = this.mensagem;
  }
  if (this.isModified('ativo') && !this.isModified('status')) {
    this.status = this.ativo ? 'ativo' : 'inativo';
  } else if (this.isModified('status') && !this.isModified('ativo')) {
    this.ativo = this.status === 'ativo';
  }
  next();
});

export default mongoose.model('Testemunho', TestemunhoSchema);
