import mongoose from 'mongoose';

const AlunoCursoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  telefone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  status: { type: String, enum: ['inscrito', 'cursando', 'concluido'], default: 'inscrito' },
  dataInscricao: { type: Date, default: Date.now }
});

const CursoSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true }, // Ex: Classe de Batismo e Novos Membros
  categoria: {
    type: String,
    enum: ['discipulado', 'batismo', 'escola_biblica', 'lideranca', 'familia'],
    default: 'escola_biblica'
  },
  descricao: { type: String, required: true, trim: true },
  professor: { type: String, trim: true },
  horario: { type: String, trim: true }, // Ex: Domingos às 08h00
  duracao: { type: String, trim: true }, // Ex: 8 aulas
  local: { type: String, default: 'Sala de Ensino MIR', trim: true },
  imagem: { type: String, default: '' },
  materialUrl: { type: String, trim: true }, // Link opcional para apostila PDF
  vagas: { type: Number, default: 0 }, // 0 = ilimitado
  inscricoesAbertas: { type: Boolean, default: true },
  ativo: { type: Boolean, default: true },
  alunos: [AlunoCursoSchema]
}, {
  timestamps: true
});

CursoSchema.index({ ativo: 1, categoria: 1 });

export default mongoose.model('Curso', CursoSchema);

