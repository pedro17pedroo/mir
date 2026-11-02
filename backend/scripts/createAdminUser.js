import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const MONGO_URL = process.env.MONGODB_URI;

async function createAdmin() {
  await mongoose.connect(MONGO_URL);
  const email = 'pedro.nekaka@gmail.com';
  const password = 'Admin1';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Usuário já existe.');
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hash,
    role: 'admin',
    nome: 'Pedro',
    ativo: true
  });
  await user.save();
  console.log('Usuário admin criado com sucesso!');
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
