import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Menu from '../models/Menu.js';

dotenv.config();

const atualizarMenus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');

    // Atualizar submenu "Ministério"
    await Menu.updateOne(
      { titulo: 'Ministério' },
      { $set: { url: '/ministerio' } }
    );
    console.log('✅ Menu "Ministério" atualizado');

    // Atualizar submenu "No que Cremos"
    await Menu.updateOne(
      { titulo: 'No que Cremos' },
      { $set: { url: '/no-que-cremos' } }
    );
    console.log('✅ Menu "No que Cremos" atualizado');

    // Atualizar submenu "Presidente do MIR"
    await Menu.updateOne(
      { titulo: 'Presidente do MIR' },
      { $set: { url: '/presidente' } }
    );
    console.log('✅ Menu "Presidente do MIR" atualizado');

    console.log('\n🎉 MENUS ATUALIZADOS COM SUCESSO!');
    console.log('\nAgora os links do menu "Sobre" apontam para as páginas corretas:');
    console.log('   • Ministério → /ministerio');
    console.log('   • No que Cremos → /no-que-cremos');
    console.log('   • Presidente do MIR → /presidente');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

atualizarMenus();
