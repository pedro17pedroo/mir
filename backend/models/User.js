import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'pastor', 'secretaria', 'midia', 'tesouraria'],
    default: 'admin'
  },
  nome: { type: String, trim: true },
  cargo: { type: String, trim: true },
  telefone: { type: String, trim: true },
  ativo: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
