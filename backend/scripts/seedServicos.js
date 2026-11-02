import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Servicos from '../models/Servicos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

const seedServicos = async () => {
  try {
    await connectDB();

    console.log('\n⛪ Criando serviços...');
    await Servicos.deleteMany({});
    
    await Servicos.create({
      titulo: 'Nossos Serviços',
      servicos: [
        {
          titulo: 'Culto de Celebração',
          descricao: 'Nosso principal culto de adoração e ensino da Palavra. Venha celebrar com a gente!',
          horario: 'Domingos às 10h',
          icone: 'FaChurch',
          cor: '#9333ea',
          exibirNaLanding: true
        },
        {
          titulo: 'Culto de Oração',
          descricao: 'Momento especial de intercessão e busca pela presença de Deus.',
          horario: 'Quartas-feiras às 19h30',
          icone: 'FaPray',
          cor: '#ec4899',
          exibirNaLanding: true
        },
        {
          titulo: 'Escola Bíblica Dominical',
          descricao: 'Estudo aprofundado da Palavra de Deus para todas as idades.',
          horario: 'Domingos às 9h',
          icone: 'FaBible',
          cor: '#8b5cf6',
          exibirNaLanding: true
        },
        {
          titulo: 'Culto de Jovens',
          descricao: 'Encontro especial para jovens com louvor, ensino e comunhão.',
          horario: 'Sextas-feiras às 20h',
          icone: 'FaUsers',
          cor: '#06b6d4',
          exibirNaLanding: false
        },
        {
          titulo: 'Ministério Infantil',
          descricao: 'Atividades e ensino bíblico para crianças de 3 a 12 anos.',
          horario: 'Domingos às 10h',
          icone: 'FaChild',
          cor: '#f59e0b',
          exibirNaLanding: false
        },
        {
          titulo: 'Grupo de Louvor',
          descricao: 'Ensaios e preparação para ministração nos cultos.',
          horario: 'Sábados às 15h',
          icone: 'FaMusic',
          cor: '#10b981',
          exibirNaLanding: false
        }
      ]
    });

    console.log('✅ Serviços criados com sucesso!');
    console.log('\n📋 Serviços cadastrados:');
    console.log('   • Culto de Celebração - Domingos às 10h');
    console.log('   • Culto de Oração - Quartas-feiras às 19h30');
    console.log('   • Escola Bíblica Dominical - Domingos às 9h');
    console.log('   • Culto de Jovens - Sextas-feiras às 20h');
    console.log('   • Ministério Infantil - Domingos às 10h');
    console.log('   • Grupo de Louvor - Sábados às 15h');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar serviços:', error);
    process.exit(1);
  }
};

seedServicos();
