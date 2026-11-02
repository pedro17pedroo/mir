import mongoose from 'mongoose';

const FotoSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true },
  legenda: { type: String, trim: true, default: '' }
});

const AlbumSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    descricao: { type: String, trim: true, default: '' },
    categoria: {
      type: String,
      enum: [
        'Culto',
        'Batismo',
        'Conferência',
        'Ação Social',
        'Jovens',
        'Casamento',
        'Infantil',
        'Outro'
      ],
      default: 'Culto'
    },
    dataEvento: { type: Date, default: Date.now },
    capa: { type: String, trim: true, default: '' },
    fotos: [FotoSchema],
    destaque: { type: Boolean, default: false },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

AlbumSchema.pre('validate', function (next) {
  if (this.titulo && !this.slug) {
    this.slug =
      this.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString().slice(-4);
  }
  if (!this.capa && Array.isArray(this.fotos) && this.fotos.length > 0) {
    this.capa = this.fotos[0].url;
  }
  next();
});

export default mongoose.model('Album', AlbumSchema);

