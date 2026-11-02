import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  email: { type: String, trim: true, lowercase: true },
  ativo: { type: Boolean, default: true },
  titulo: { type: String },
  conteudo: { type: String },
  dataEnvio: { type: Date, default: Date.now },
  destinatarios: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Newsletter', NewsletterSchema);
