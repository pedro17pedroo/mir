import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Menu from '../models/Menu.js';

dotenv.config();

const seedMenus = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/igreja_cms';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB conectado:', mongoUri);

    // Limpar menus existentes
    await Menu.deleteMany({});
    console.log('🗑️  Menus antigos removidos');

    // Criar menus principais originais
    const inicio = await Menu.create({
      titulo: 'Início',
      url: '/',
      ordem: 0,
      ativo: true
    });

    const sobre = await Menu.create({
      titulo: 'Sobre',
      url: '',
      ordem: 1,
      ativo: true
    });

    const servicos = await Menu.create({
      titulo: 'Serviços',
      url: '/servicos',
      ordem: 2,
      ativo: true
    });

    const ensino = await Menu.create({
      titulo: 'Ensino',
      url: '',
      ordem: 3,
      ativo: true
    });

    const plataformaEnsino = await Menu.create({
      titulo: 'Plataforma de ensino',
      url: '',
      ordem: 4,
      ativo: true
    });

    const eventos = await Menu.create({
      titulo: 'Eventos',
      url: '/eventos',
      ordem: 5,
      ativo: true
    });

    const contacto = await Menu.create({
      titulo: 'Contacto',
      url: '/contato',
      ordem: 6,
      ativo: true
    });

    console.log('✅ Menus principais criados');

    // Criar submenus para "Sobre"
    await Menu.create([
      {
        titulo: 'Ministério',
        url: '/sobre/ministerio',
        ordem: 0,
        ativo: true,
        parentId: sobre._id
      },
      {
        titulo: 'No que Cremos',
        url: '/sobre/no-que-cremos',
        ordem: 1,
        ativo: true,
        parentId: sobre._id
      },
      {
        titulo: 'Presidente do MIR',
        url: '/sobre/presidente',
        ordem: 2,
        ativo: true,
        parentId: sobre._id
      },
      {
        titulo: 'Ministérios e Células',
        url: '/ministerios',
        ordem: 3,
        ativo: true,
        parentId: sobre._id
      },
      {
        titulo: 'Sou Novo Aqui',
        url: '/sou-novo',
        ordem: 4,
        ativo: true,
        parentId: sobre._id
      }
    ]);

    console.log('✅ Submenus de "Sobre" criados');

    // Criar submenus para "Ensino"
    await Menu.create([
      {
        titulo: 'Áudios',
        url: '/ensino/audio',
        ordem: 0,
        ativo: true,
        parentId: ensino._id
      },
      {
        titulo: 'Vídeos',
        url: '/ensino/video',
        ordem: 1,
        ativo: true,
        parentId: ensino._id
      },
      {
        titulo: 'Escola Bíblica e Cursos',
        url: '/ensino/cursos',
        ordem: 2,
        ativo: true,
        parentId: ensino._id
      },
      {
        titulo: 'Devocional & Palavra Pastoral',
        url: '/devocional',
        ordem: 3,
        ativo: true,
        parentId: ensino._id
      }
    ]);

    console.log('✅ Submenus de "Ensino" criados');

    // Criar submenus para "Plataforma de ensino"
    await Menu.create([
      {
        titulo: 'Conferência de Fé',
        url: '/conferencia-fe',
        ordem: 0,
        ativo: true,
        parentId: plataformaEnsino._id
      },
      {
        titulo: 'Escola de Fundação',
        url: '/escola-fundacao',
        ordem: 1,
        ativo: true,
        parentId: plataformaEnsino._id
      },
      {
        titulo: 'Conferência de Ministros',
        url: '/conferencia-ministros',
        ordem: 2,
        ativo: true,
        parentId: plataformaEnsino._id
      },
      {
        titulo: 'Conferência de Mulheres',
        url: '/conferencia-mulheres',
        ordem: 3,
        ativo: true,
        parentId: plataformaEnsino._id
      },
      {
        titulo: 'Conferência dos Jovens',
        url: '/conferencia-jovens',
        ordem: 4,
        ativo: true,
        parentId: plataformaEnsino._id
      },
      {
        titulo: 'Mulheres Transformadas',
        url: '/mulheres-transformadas',
        ordem: 5,
        ativo: true,
        parentId: plataformaEnsino._id
      },
      {
        titulo: 'Reis e Sacerdotes',
        url: '/reis-sacerdotes',
        ordem: 6,
        ativo: true,
        parentId: plataformaEnsino._id
      }
    ]);

    console.log('✅ Submenus de "Plataforma de ensino" criados');

    console.log('\n🎉 ROLLBACK DO MENU CONCLUÍDO COM SUCESSO!');
    console.log('\n📋 Estrutura restaurada:');
    console.log('   • Início');
    console.log('   • Sobre ▼ (Ministério, No que Cremos, Presidente, Ministérios e Células, Sou Novo)');
    console.log('   • Serviços');
    console.log('   • Ensino ▼ (Áudios, Vídeos, Escola Bíblica, Devocional)');
    console.log('   • Plataforma de ensino ▼ (7 Conferências)');
    console.log('   • Eventos');
    console.log('   • Contacto');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

seedMenus();
