import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  subtitulo: { type: String },
  descricao: { type: String },
  conteudo: { type: String },
  imagem: { type: String },
  posicaoImagem: { type: String, default: 'center' }, // top, center, bottom
  link: { type: String },
  textoBotao: { type: String, default: 'Saiba Mais' },
  corBotao: { type: String, default: '#facc15' },
  textoBotaoSecundario: { type: String, default: 'Próximos Eventos' },
  linkBotaoSecundario: { type: String, default: '#eventos' },
  mostrarBotoes: { type: Boolean, default: true },
  tipo: { type: String, default: 'carrossel' }, // hero, carrossel, serviços, testemunhos, etc
  ordem: { type: Number, default: 0 },
  ativo: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Section', SectionSchema);
