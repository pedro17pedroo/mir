import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  imagem: { type: String },
  data: { type: Date },
  categoria: { type: String }
}, { timestamps: true });

export default mongoose.model('Content', ContentSchema);
