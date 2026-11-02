import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  endereco: {
    rua: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true },
    pais: { type: String, default: 'Brasil' }
  },
  localizacao: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  telefones: [{
    tipo: { type: String, enum: ['principal', 'whatsapp', 'secretaria'], default: 'principal' },
    numero: { type: String, required: true }
  }],
  emails: [{
    tipo: { type: String, enum: ['geral', 'pastoral', 'secretaria'], default: 'geral' },
    email: { type: String, required: true }
  }],
  horariosFuncionamento: [{
    dia: { type: String, required: true },
    horario: { type: String, required: true }
  }],
  redesSociais: {
    facebook: String,
    instagram: String,
    youtube: String,
    twitter: String
  },
  mensagemBemVindo: String
}, { timestamps: true });

export default mongoose.model('ContactInfo', contactInfoSchema);
