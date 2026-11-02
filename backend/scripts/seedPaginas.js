import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Page from '../models/Page.js';
import User from '../models/User.js';

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB...');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

// Páginas iniciais
const paginasIniciais = [
  {
    titulo: 'Início',
    slug: 'inicio',
    conteudo: '<h1>Bem-vindo à Igreja MIR</h1><p>Esta é a página inicial do nosso site. Em breve, você encontrará informações sobre nossos cultos, eventos e muito mais.</p>',
    metaDescricao: 'Igreja MIR - Uma comunidade de fé, amor e esperança',
    ativa: true,
    menu: true,
    ordemMenu: 0,
  },
  {
    titulo: 'Sobre Nós',
    slug: 'sobre',
    conteudo: '<h1>Sobre Nós</h1><p>A Igreja MIR é uma comunidade cristã comprometida em compartilhar o amor de Deus e fazer discípulos de Jesus Cristo.</p><h2>Nossa Missão</h2><p>Nossa missão é levar as pessoas a conhecerem a Cristo, crescerem em sua fé e servirem uns aos outros com amor.</p>',
    metaDescricao: 'Conheça mais sobre a Igreja MIR, nossa missão, visão e valores',
    ativa: true,
    menu: true,
    ordemMenu: 1,
  },
  {
    titulo: 'Cultos',
    slug: 'cultos',
    conteudo: '<h1>Nossos Cultos</h1><h2>Domingo</h2><p>9h - Escola Bíblica Dominical</p><p>18h - Culto de Celebração</p><h2>Quarta-feira</h2><p>19h30 - Culto de Oração e Estudo Bíblico</p>',
    metaDescricao: 'Horários dos nossos cultos e reuniões',
    ativa: true,
    menu: true,
    ordemMenu: 2,
  },
  {
    titulo: 'Eventos',
    slug: 'eventos',
    conteudo: '<h1>Próximos Eventos</h1><p>Fique por dentro dos nossos próximos eventos, retiros e conferências.</p>',
    metaDescricao: 'Confira nossa agenda de eventos e participe conosco',
    ativa: true,
    menu: true,
    ordemMenu: 3,
  },
  {
    titulo: 'Contato',
    slug: 'contato',
    conteudo: '<h1>Entre em Contato</h1><p>Estamos à disposição para tirar suas dúvidas e orar por você.</p><p><strong>Endereço:</strong> Rua Exemplo, 123 - Bairro, Cidade - Estado, CEP 00000-000</p><p><strong>Telefone:</strong> (00) 0000-0000</p><p><strong>Email:</strong> contato@igrejamiradouro.com</p>',
    metaDescricao: 'Entre em contato conosco. Estamos à disposição para ajudar',
    ativa: true,
    menu: true,
    ordemMenu: 4,
  },
];

const seedPaginas = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();

    // Encontrar um usuário admin para associar às páginas
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('Nenhum usuário admin encontrado. Crie um usuário admin primeiro.');
      process.exit(1);
    }

    console.log('Usuário admin encontrado:', adminUser.email);

    // Inserir páginas iniciais
    for (const pagina of paginasIniciais) {
      // Verificar se a página já existe
      const existePagina = await Page.findOne({ slug: pagina.slug });
      
      if (!existePagina) {
        // Adicionar o ID do usuário admin
        pagina.criadoPor = adminUser._id;
        pagina.atualizadoPor = adminUser._id;
        
        await Page.create(pagina);
        console.log(`Página criada: ${pagina.titulo}`);
      } else {
        console.log(`Página já existe: ${pagina.titulo}`);
      }
    }

    console.log('Seed de páginas concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar o seed de páginas:', error);
    process.exit(1);
  }
};

// Executar o seed
seedPaginas();
