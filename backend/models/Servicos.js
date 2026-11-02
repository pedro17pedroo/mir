import mongoose from 'mongoose';

const ServicoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  horario: String,
  icone: String,
  cor: String,
  exibirNaLanding: { type: Boolean, default: true }
});

const ServicosSchema = new mongoose.Schema({
  titulo: String,
  servicos: [ServicoSchema]
});

const Servicos = mongoose.model('Servicos', ServicosSchema);
export default Servicos;
