import mongoose from 'mongoose';

const MensagemSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  versiculo: { type: String, default: '' },
  resumo: { type: String },
  conteudo: { type: String },
  oracaoFinal: { type: String, default: '' },
  imagem: { type: String, default: '' },
  corGradienteInicio: { type: String, default: '#a855f7' },
  corGradienteFim: { type: String, default: '#ec4899' },
  corTexto: { type: String, default: '#ffffff' },
  corCurvaFundo: { type: String, default: '' },
  mostrarCurva: { type: Boolean, default: true },
  estiloCurva: { type: String, default: 'onda' },
  data: { type: Date, default: Date.now },
  autor: { type: String },
  categoria: { type: String, default: 'Devocional Diário' },
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' }
}, { timestamps: true });

export default mongoose.model('Mensagem', MensagemSchema);
