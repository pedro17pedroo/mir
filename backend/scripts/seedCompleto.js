import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Models
import User from '../models/User.js';
import Page from '../models/Page.js';
import Section from '../models/Section.js';
import Evento from '../models/Evento.js';
import Testemunho from '../models/Testemunho.js';
import SobreOPastor from '../models/SobreOPastor.js';
import Servicos from '../models/Servicos.js';
import Theme from '../models/Theme.js';
import Menu from '../models/Menu.js';
import Mensagem from '../models/Mensagem.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

const seedCompleto = async () => {
  try {
    await connectDB();

    console.log('\n🌱 Iniciando seed completo...\n');

    // 1. Criar usuário admin
    console.log('👤 Criando usuário admin...');
    let adminUser = await User.findOne({ email: 'admin@igrejamir.com' });
    
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('Admin123', salt);
      adminUser = await User.create({
        email: 'admin@igrejamir.com',
        password: hash,
        role: 'admin'
      });
      console.log('✅ Usuário admin criado: admin@igrejamir.com / Admin123');
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }

    // 2. Criar tema
    console.log('\n🎨 Configurando tema...');
    await Theme.deleteMany({});
    await Theme.create({
      // Cores gerais
      corPrimaria: '#9333ea',
      corSecundaria: '#ec4899',
      corFundo: '#ffffff',
      corTexto: '#1f2937',
      
      // Hero Landing Page (Home)
      heroHomeGradienteInicio: '#9333ea',
      heroHomeGradienteFim: '#ec4899',
      heroHomeGradienteDirecao: 'to right',
      heroHomeTextoTitulo: '#ffffff',
      heroHomeTextoSubtitulo: '#f3f4f6',
      heroHomeCurvaEstilo: 'wave',
      heroHomeCurvaCor: '#ffffff',
      heroHomeAltura: 'medium',
      heroHomeOverlay: 'gradient',
      
      // Hero Páginas Internas
      heroPaginasGradienteInicio: '#9333ea',
      heroPaginasGradienteFim: '#ec4899',
      heroPaginasGradienteDirecao: 'to right',
      heroPaginasTextoTitulo: '#ffffff',
      heroPaginasTextoSubtitulo: '#f3f4f6',
      heroPaginasCurvaEstilo: 'wave',
      heroPaginasCurvaCor: '#ffffff',
      heroPaginasAltura: 'medium',
      heroPaginasOverlay: 'gradient'
    });
    console.log('✅ Tema configurado');

    // 3. Criar slides do carrossel
    console.log('\n🎠 Criando slides do carrossel...');
    await Section.deleteMany({ tipo: 'carrossel' });
    const slides = [
      {
        tipo: 'carrossel',
        titulo: 'Bem-vindo à Igreja MIR',
        descricao: 'Uma comunidade de fé, amor e esperança',
        imagem: '/default-hero.jpg',
        ordem: 1,
        ativo: true
      },
      {
        tipo: 'carrossel',
        titulo: 'Venha nos visitar!',
        descricao: 'Cultos aos domingos às 9h e 18h',
        imagem: '/462472985_847019490833606_8317740753907028064_n.jpg',
        ordem: 2,
        ativo: true
      },
      {
        tipo: 'carrossel',
        titulo: 'Conecte-se conosco',
        descricao: 'Faça parte da nossa família',
        imagem: '/462695117_850061797196042_8793324812043021237_n.jpg',
        ordem: 3,
        ativo: true
      }
    ];
    await Section.insertMany(slides);
    console.log(`✅ ${slides.length} slides criados`);

    // 4. Criar Sobre o Pastor
    console.log('\n👨‍💼 Criando seção Sobre o Pastor...');
    await SobreOPastor.deleteMany({});
    await SobreOPastor.create({
      titulo: 'Conheça Nosso Pastor',
      texto: 'Pastor João Silva lidera nossa comunidade com dedicação e amor há mais de 15 anos. Formado em Teologia, ele é casado com Maria Silva e juntos têm 3 filhos. Sua paixão é ver vidas transformadas pelo poder de Deus e discipular pessoas para que cresçam em sua fé.',
      imagem: '/pastor-bg.jpg',
      corFundo: 'rgba(109, 40, 217, 0.9)',
      corTitulo: '#FFC107',
      corTexto: '#FFFFFF',
      textoBotao: 'Saiba Mais',
      linkBotao: '/sobre',
      corBotao: '#FFC107'
    });
    console.log('✅ Seção Sobre o Pastor criada');

    // 5. Criar Serviços/Horários
    console.log('\n⛪ Criando horários de serviços...');
    await Servicos.deleteMany({});
    await Servicos.create({
      titulo: 'Nossos Serviços',
      servicos: [
        {
          titulo: 'Culto de Celebração',
          descricao: 'Nosso principal culto de adoração e ensino da Palavra. Venha celebrar com a gente!',
          horario: 'Domingos às 10h',
          icone: 'FaChurch',
          cor: '#9333ea'
        },
        {
          titulo: 'Culto de Oração',
          descricao: 'Momento especial de intercessão e busca pela presença de Deus.',
          horario: 'Quartas-feiras às 19h30',
          icone: 'FaPray',
          cor: '#ec4899'
        },
        {
          titulo: 'Escola Bíblica Dominical',
          descricao: 'Estudo aprofundado da Palavra de Deus para todas as idades.',
          horario: 'Domingos às 9h',
          icone: 'FaBible',
          cor: '#8b5cf6'
        },
        {
          titulo: 'Culto de Jovens',
          descricao: 'Encontro especial para jovens com louvor, ensino e comunhão.',
          horario: 'Sextas-feiras às 20h',
          icone: 'FaUsers',
          cor: '#06b6d4'
        },
        {
          titulo: 'Ministério Infantil',
          descricao: 'Atividades e ensino bíblico para crianças de 3 a 12 anos.',
          horario: 'Domingos às 10h',
          icone: 'FaChild',
          cor: '#f59e0b'
        },
        {
          titulo: 'Grupo de Louvor',
          descricao: 'Ensaios e preparação para ministração nos cultos.',
          horario: 'Sábados às 15h',
          icone: 'FaMusic',
          cor: '#10b981'
        }
      ]
    });
    console.log('✅ Horários de serviços criados');

    // 6. Criar Eventos
    console.log('\n📅 Criando eventos...');
    await Evento.deleteMany({});
    const hoje = new Date();
    const eventos = [
      {
        titulo: 'Conferência de Jovens 2026',
        descricao: 'Três dias de adoração, ensino e comunhão para jovens de 15 a 30 anos.',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 15),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 17),
        local: 'Igreja MIR - Auditório Principal',
        imagem: '/463472566_853116683557220_7774651744882508717_n.jpg',
        ativo: true
      },
      {
        titulo: 'Retiro de Casais',
        descricao: 'Um fim de semana especial para fortalecer o relacionamento conjugal.',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth() + 2, 5),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth() + 2, 7),
        local: 'Chácara Recanto da Paz',
        imagem: '/462797886_850062017196020_2865839217625575446_n.jpg',
        ativo: true
      },
      {
        titulo: 'Escola Bíblica de Férias',
        descricao: 'Atividades especiais para crianças durante as férias escolares.',
        dataInicio: new Date(hoje.getFullYear(), hoje.getMonth() + 3, 10),
        dataFim: new Date(hoje.getFullYear(), hoje.getMonth() + 3, 14),
        local: 'Igreja MIR - Salão Infantil',
        imagem: '/462855902_850781923790696_5446232258874273441_n.jpg',
        ativo: true
      }
    ];
    await Evento.insertMany(eventos);
    console.log(`✅ ${eventos.length} eventos criados`);

    // 7. Criar Testemunhos
    console.log('\n💬 Criando testemunhos...');
    await Testemunho.deleteMany({});
    const testemunhos = [
      {
        nome: 'Maria Santos',
        mensagem: 'Minha vida foi completamente transformada desde que conheci Jesus nesta igreja. Encontrei uma família que me acolheu e me ajudou a crescer na fé.',
        local: 'Membro há 3 anos',
        foto: '/462857619_850781057124116_442733073422476491_n.jpg',
        aprovado: true
      },
      {
        nome: 'João Oliveira',
        mensagem: 'Estava passando por um momento difícil e encontrei apoio e oração nesta comunidade. Hoje sou grato a Deus por cada pessoa que Ele colocou em meu caminho.',
        local: 'Membro há 5 anos',
        foto: '/462875530_850784157123806_7998310158587374117_n.jpg',
        aprovado: true
      },
      {
        nome: 'Ana Paula Costa',
        mensagem: 'Os ensinamentos que recebo aqui têm me ajudado a ser uma pessoa melhor, uma mãe melhor e uma profissional melhor. Glória a Deus!',
        local: 'Membro há 2 anos',
        foto: '/462923004_850063330529222_6100758807752908474_n.jpg',
        aprovado: true
      }
    ];
    await Testemunho.insertMany(testemunhos);
    console.log(`✅ ${testemunhos.length} testemunhos criados`);

    // 8. Criar Páginas
    console.log('\n📄 Criando páginas...');
    await Page.deleteMany({});
    const paginas = [
      {
        titulo: 'Início',
        slug: 'inicio',
        conteudo: '<h1>Bem-vindo à Igreja MIR</h1><p>Uma comunidade de fé, amor e esperança.</p>',
        metaDescricao: 'Igreja MIR - Uma comunidade de fé, amor e esperança',
        ativa: true,
        menu: true,
        ordemMenu: 0,
        criadoPor: adminUser._id
      },
      {
        titulo: 'Sobre Nós',
        slug: 'sobre',
        conteudo: `
          <h1>Sobre a Igreja MIR</h1>
          <p>A Igreja MIR é uma comunidade cristã comprometida em compartilhar o amor de Deus e fazer discípulos de Jesus Cristo.</p>
          
          <h2>Nossa Missão</h2>
          <p>Levar as pessoas a conhecerem a Cristo, crescerem em sua fé e servirem uns aos outros com amor.</p>
          
          <h2>Nossa Visão</h2>
          <p>Ser uma igreja relevante, que impacta vidas e transforma comunidades através do evangelho de Jesus Cristo.</p>
          
          <h2>Nossos Valores</h2>
          <ul>
            <li><strong>Fé:</strong> Cremos na Palavra de Deus como nossa única regra de fé e prática</li>
            <li><strong>Amor:</strong> Amamos a Deus sobre todas as coisas e ao próximo como a nós mesmos</li>
            <li><strong>Comunhão:</strong> Valorizamos os relacionamentos e a vida em comunidade</li>
            <li><strong>Serviço:</strong> Servimos uns aos outros e à sociedade com excelência</li>
            <li><strong>Integridade:</strong> Vivemos de acordo com os princípios bíblicos em todas as áreas</li>
          </ul>
        `,
        metaDescricao: 'Conheça mais sobre a Igreja MIR, nossa missão, visão e valores',
        ativa: true,
        menu: true,
        ordemMenu: 1,
        criadoPor: adminUser._id
      },
      {
        titulo: 'Ministérios',
        slug: 'ministerios',
        conteudo: `
          <h1>Nossos Ministérios</h1>
          <p>Temos diversos ministérios para você se conectar e servir:</p>
          
          <h2>Ministério de Louvor</h2>
          <p>Adoração e música para glorificar a Deus.</p>
          
          <h2>Ministério Infantil</h2>
          <p>Ensino bíblico e atividades para crianças de 0 a 12 anos.</p>
          
          <h2>Ministério de Jovens</h2>
          <p>Comunhão e crescimento espiritual para adolescentes e jovens.</p>
          
          <h2>Ministério de Mulheres</h2>
          <p>Encontros e estudos bíblicos para mulheres de todas as idades.</p>
          
          <h2>Ministério de Homens</h2>
          <p>Fortalecimento espiritual e comunhão entre os homens da igreja.</p>
        `,
        metaDescricao: 'Conheça os ministérios da Igreja MIR e encontre seu lugar para servir',
        ativa: true,
        menu: true,
        ordemMenu: 2,
        criadoPor: adminUser._id
      },
      {
        titulo: 'Contato',
        slug: 'contato',
        conteudo: `
          <h1>Entre em Contato</h1>
          <p>Estamos à disposição para tirar suas dúvidas e orar por você.</p>
          
          <h2>Endereço</h2>
          <p>Rua Exemplo, 123 - Bairro Centro<br>
          Cidade - Estado, CEP 00000-000</p>
          
          <h2>Telefone</h2>
          <p>(00) 0000-0000</p>
          
          <h2>Email</h2>
          <p>contato@igrejamir.com</p>
          
          <h2>Redes Sociais</h2>
          <p>Siga-nos nas redes sociais para ficar por dentro de tudo!</p>
        `,
        metaDescricao: 'Entre em contato conosco. Estamos à disposição para ajudar',
        ativa: true,
        menu: true,
        ordemMenu: 3,
        criadoPor: adminUser._id
      }
    ];
    await Page.insertMany(paginas);
    console.log(`✅ ${paginas.length} páginas criadas`);

    // 9. Criar Menus
    console.log('\n🔗 Criando menus...');
    await Menu.deleteMany({});
    const menus = [
      {
        titulo: 'Início',
        url: '/',
        ordem: 0,
        ativo: true
      },
      {
        titulo: 'Sobre',
        url: '/sobre',
        ordem: 1,
        ativo: true
      },
      {
        titulo: 'Ministérios',
        url: '/ministerios',
        ordem: 2,
        ativo: true
      },
      {
        titulo: 'Eventos',
        url: '#eventos',
        ordem: 3,
        ativo: true
      },
      {
        titulo: 'Contato',
        url: '/contato',
        ordem: 4,
        ativo: true
      },
      {
        titulo: 'Doações',
        url: '/donate',
        ordem: 5,
        ativo: true
      }
    ];
    await Menu.insertMany(menus);
    console.log(`✅ ${menus.length} menus criados`);

    // 9. Criar mensagem (versículo bíblico)
    console.log('📖 Criando mensagem bíblica...');
    await Mensagem.deleteMany({});
    const mensagem = {
      titulo: 'Versículo do Dia',
      resumo: 'Pursue the Lord and his strength; seek his face always!',
      conteudo: 'Pursue the Lord and his strength; seek his face always! - 1 CHRONICLES 16:11',
      autor: 'Bíblia Sagrada',
      categoria: 'Versículo',
      status: 'ativo'
    };
    await Mensagem.create(mensagem);
    console.log('✅ Mensagem bíblica criada');

    console.log('\n✅ Seed completo finalizado com sucesso!\n');
    console.log('📝 Credenciais de acesso:');
    console.log('   Email: admin@igrejamir.com');
    console.log('   Senha: Admin123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seedCompleto();
