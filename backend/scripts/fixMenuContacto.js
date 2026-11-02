import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const menuSchema = new mongoose.Schema({
  titulo: String,
  url: String,
  ordem: Number,
  ativo: Boolean
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);

async function fixMenu() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Atualizar URL do menu Contacto
    const result = await Menu.updateOne(
      { titulo: 'Contacto' },
      { $set: { url: '/contato' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Menu "Contacto" atualizado: /contacto → /contato');
    } else {
      console.log('⚠️  Menu "Contacto" não encontrado ou já estava correto');
    }

    console.log('\n✅ Correção concluída!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fixMenu();
