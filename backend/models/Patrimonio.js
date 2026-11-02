import mongoose from 'mongoose';

const PatrimonioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    codigo: { type: String, trim: true, default: '' },
    categoria: {
      type: String,
      enum: [
        'Som e Áudio',
        'Instrumentos Musicais',
        'Vídeo e Projeção',
        'Mobiliário',
        'Informática',
        'Climatização e Energia',
        'Viaturas',
        'Imóveis',
        'Outro'
      ],
      default: 'Som e Áudio'
    },
    quantidade: { type: Number, default: 1, min: 1 },
    valorUnitario: { type: Number, default: 0, min: 0 },
    dataAquisicao: { type: Date, default: Date.now },
    estado: {
      type: String,
      enum: ['Bom', 'Regular', 'Em Manutenção', 'Danificado'],
      default: 'Bom'
    },
    localizacao: { type: String, trim: true, default: 'Templo Principal' },
    responsavel: { type: String, trim: true, default: '' },
    observacoes: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Patrimonio', PatrimonioSchema);

