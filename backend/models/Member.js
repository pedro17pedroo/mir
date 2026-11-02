import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String },
  telefone: { type: String },
  dataNascimento: { type: Date },
  endereco: { type: String },
  dataBatismo: { type: Date },
  ministerio: { type: String },
  cargo: { type: String },
  foto: { type: String, default: '' },
  posicaoFoto: { type: String, enum: ['top', 'center', 'bottom'], default: 'center' },
  gruposMinisteriais: [{ type: String }],
  ativo: { type: Boolean, default: true },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' }
}, { timestamps: true });

MemberSchema.pre('validate', function(next) {
  if (this.isModified('ativo') && !this.isModified('status')) {
    this.status = this.ativo ? 'ativo' : 'inativo';
  } else if (this.isModified('status') && !this.isModified('ativo')) {
    this.ativo = this.status === 'ativo';
  }
  if (this.ministerio && (!this.gruposMinisteriais || this.gruposMinisteriais.length === 0)) {
    this.gruposMinisteriais = [this.ministerio];
  } else if (!this.ministerio && this.gruposMinisteriais?.length > 0) {
    this.ministerio = this.gruposMinisteriais[0];
  }
  next();
});

export default mongoose.model('Member', MemberSchema);
