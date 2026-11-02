import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Evento from '../models/Evento.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
};

const addSlugs = async () => {
  try {
    console.log('\n🔧 Adicionando slugs aos eventos...\n');

    const eventos = await Evento.find({});
    console.log(`📊 Encontrados ${eventos.length} eventos`);

    for (const evento of eventos) {
      if (!evento.slug) {
        const slug = evento.titulo
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim()
          .replace(/^-+|-+$/g, '');
        
        evento.slug = slug;
        await evento.save();
        console.log(`✅ Slug adicionado: ${evento.titulo} → ${slug}`);
      } else {
        console.log(`⏭️  Evento já tem slug: ${evento.titulo}`);
      }
    }

    console.log('\n🎉 Slugs adicionados com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

connectDB().then(addSlugs);
