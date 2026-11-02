import mongoose from 'mongoose';

const SobreOPastorSchema = new mongoose.Schema({
  titulo: String,
  texto: String,
  imagem: String,
  corTitulo: String,
  corTexto: String,
  corBotao: String,
  textoBotao: String,
  linkBotao: String,
  corFundo: String,
  transparencia: { type: Number, default: 85 } // 0-100
});

const SobreOPastor = mongoose.model('SobreOPastor', SobreOPastorSchema);
export default SobreOPastor;
