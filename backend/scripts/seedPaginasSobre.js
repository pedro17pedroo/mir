import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Page from '../models/Page.js';
import User from '../models/User.js';

dotenv.config();

const seedPaginasSobre = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');

    // Buscar usuário admin
    const adminUser = await User.findOne({ email: 'admin@igrejamir.com' });
    if (!adminUser) {
      console.error('❌ Usuário admin não encontrado. Execute o seed completo primeiro.');
      process.exit(1);
    }

    // Criar página "Ministério"
    const ministerioPage = await Page.findOne({ slug: 'ministerio' });
    if (!ministerioPage) {
      await Page.create({
        titulo: 'Nosso Ministério',
        slug: 'ministerio',
        conteudo: `
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold text-gray-900 mb-6">Nosso Ministério</h1>
            
            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-700 mb-6">
                O Ministério Internacional Renascer (MIR) é uma igreja comprometida com a transformação de vidas através do poder do Evangelho de Jesus Cristo.
              </p>

              <h2 class="text-3xl font-bold text-gray-900 mt-8 mb-4">Nossa Missão</h2>
              <p class="text-gray-700 mb-4">
                Levar a mensagem de esperança, fé e amor de Cristo a todas as nações, equipando e capacitando os santos para o ministério, 
                e edificando uma igreja forte, relevante e impactante na sociedade.
              </p>

              <h2 class="text-3xl font-bold text-gray-900 mt-8 mb-4">Nossa Visão</h2>
              <p class="text-gray-700 mb-4">
                Ser uma igreja referência em ensino bíblico, adoração genuína e ação social, alcançando milhares de vidas com o amor de Cristo 
                e formando discípulos comprometidos com o Reino de Deus.
              </p>

              <h2 class="text-3xl font-bold text-gray-900 mt-8 mb-4">Nossos Valores</h2>
              <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li><strong>Fé:</strong> Cremos no poder transformador da Palavra de Deus</li>
                <li><strong>Amor:</strong> Amamos a Deus acima de tudo e ao próximo como a nós mesmos</li>
                <li><strong>Comunhão:</strong> Valorizamos o relacionamento e a unidade do corpo de Cristo</li>
                <li><strong>Excelência:</strong> Fazemos tudo com excelência para a glória de Deus</li>
                <li><strong>Integridade:</strong> Vivemos de acordo com os princípios bíblicos</li>
                <li><strong>Serviço:</strong> Servimos com alegria e dedicação ao Reino de Deus</li>
              </ul>

              <h2 class="text-3xl font-bold text-gray-900 mt-8 mb-4">Nossa História</h2>
              <p class="text-gray-700 mb-4">
                Fundada com o propósito de alcançar vidas e transformar comunidades, o MIR tem sido um farol de esperança e fé. 
                Ao longo dos anos, temos visto Deus operar milagres, restaurar famílias e levantar líderes comprometidos com o Evangelho.
              </p>

              <p class="text-gray-700 mb-4">
                Hoje, continuamos firmes no propósito de pregar o Evangelho, fazer discípulos e impactar nossa geração com o amor de Cristo.
              </p>

              <div class="bg-purple-50 border-l-4 border-purple-600 p-6 mt-8">
                <p class="text-lg font-semibold text-purple-900 mb-2">
                  "Portanto ide, fazei discípulos de todas as nações..."
                </p>
                <p class="text-purple-700">Mateus 28:19</p>
              </div>
            </div>
          </div>
        `,
        metaDescricao: 'Conheça o Ministério Internacional Renascer (MIR), nossa missão, visão e valores.',
        ativa: true,
        menu: true,
        ordemMenu: 1,
        criadoPor: adminUser._id
      });
      console.log('✅ Página "Ministério" criada');
    } else {
      console.log('ℹ️  Página "Ministério" já existe');
    }

    // Criar página "No que Cremos"
    const cremosPage = await Page.findOne({ slug: 'no-que-cremos' });
    if (!cremosPage) {
      await Page.create({
        titulo: 'No que Cremos',
        slug: 'no-que-cremos',
        conteudo: `
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold text-gray-900 mb-6">No que Cremos</h1>
            
            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-700 mb-8">
                Nossa fé está fundamentada na Palavra de Deus, a Bíblia Sagrada, que é a nossa única regra de fé e prática.
              </p>

              <div class="space-y-8">
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 class="text-2xl font-bold text-purple-900 mb-3">🙏 Cremos em Deus</h2>
                  <p class="text-gray-700">
                    Cremos em um só Deus, eternamente subsistente em três pessoas: o Pai, o Filho e o Espírito Santo. 
                    Criador do universo, de todas as coisas visíveis e invisíveis, e mantenedor de todas as coisas.
                  </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 class="text-2xl font-bold text-purple-900 mb-3">✝️ Cremos em Jesus Cristo</h2>
                  <p class="text-gray-700">
                    Cremos em Jesus Cristo, o Filho de Deus, concebido pelo Espírito Santo, nascido da virgem Maria. 
                    Verdadeiro Deus e verdadeiro homem, que morreu na cruz pelos nossos pecados, ressuscitou ao terceiro dia 
                    e está assentado à direita de Deus Pai, de onde há de vir para julgar os vivos e os mortos.
                  </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 class="text-2xl font-bold text-purple-900 mb-3">🕊️ Cremos no Espírito Santo</h2>
                  <p class="text-gray-700">
                    Cremos no Espírito Santo, a terceira pessoa da Trindade, que convence o mundo do pecado, da justiça e do juízo. 
                    Ele regenera o pecador, batiza, habita, guia, ensina e enche de poder o crente para o serviço e testemunho cristão.
                  </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 class="text-2xl font-bold text-purple-900 mb-3">📖 Cremos na Bíblia</h2>
                  <p class="text-gray-700">
                    Cremos na inspiração divina, verbal e plenária da Bíblia Sagrada, única regra infalível de fé e prática 
                    para a vida e o caráter do cristão. A Palavra de Deus é viva, eficaz e permanece para sempre.
                  </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 class="text-2xl font-bold text-purple-900 mb-3">💒 Cremos na Igreja</h2>
                  <p class="text-gray-700">
                    Cremos na Igreja, corpo místico de Cristo, formada por todos os que creem em Jesus como Salvador e Senhor. 
                    A Igreja tem a missão de pregar o Evangelho, fazer discípulos, batizar e ensinar a Palavra de Deus.
                  </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 class="text-2xl font-bold text-purple-900 mb-3">🎺 Cremos na Volta de Cristo</h2>
                  <p class="text-gray-700">
                    Cremos na segunda vinda de Cristo, de forma pessoal, corporal e visível, para buscar a Sua Igreja. 
                    Cremos no arrebatamento da Igreja, no juízo final, na ressurreição dos mortos e na vida eterna.
                  </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 class="text-2xl font-bold text-purple-900 mb-3">💧 Cremos nas Ordenanças</h2>
                  <p class="text-gray-700">
                    Cremos no batismo em águas por imersão, em nome do Pai, do Filho e do Espírito Santo, e na Santa Ceia, 
                    como memorial do sacrifício de Cristo na cruz.
                  </p>
                </div>
              </div>

              <div class="bg-purple-600 text-white p-8 rounded-lg mt-10">
                <p class="text-2xl font-bold mb-4 text-center">
                  "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus."
                </p>
                <p class="text-center text-purple-200">Efésios 2:8</p>
              </div>
            </div>
          </div>
        `,
        metaDescricao: 'Conheça as doutrinas e crenças fundamentais do Ministério Internacional Renascer.',
        ativa: true,
        menu: true,
        ordemMenu: 2,
        criadoPor: adminUser._id
      });
      console.log('✅ Página "No que Cremos" criada');
    } else {
      console.log('ℹ️  Página "No que Cremos" já existe');
    }

    // Criar página "Presidente do MIR"
    const presidentePage = await Page.findOne({ slug: 'presidente' });
    if (!presidentePage) {
      await Page.create({
        titulo: 'Presidente do MIR',
        slug: 'presidente',
        conteudo: `
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold text-gray-900 mb-6">Presidente do MIR</h1>
            
            <div class="prose prose-lg max-w-none">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg mb-8">
                <h2 class="text-3xl font-bold mb-4">Liderança Ungida e Comprometida</h2>
                <p class="text-lg">
                  Conheça a liderança do Ministério Internacional Renascer, escolhida por Deus para guiar e pastorear o rebanho.
                </p>
              </div>

              <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                  <div class="w-32 h-32 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-5xl">👨‍💼</span>
                  </div>
                  <h3 class="text-2xl font-bold text-center text-gray-900 mb-2">Pastor Presidente</h3>
                  <p class="text-center text-gray-600 mb-4">Líder e Fundador do MIR</p>
                  <p class="text-gray-700">
                    Com uma vida dedicada ao ministério e ao serviço do Reino de Deus, nosso pastor presidente 
                    tem sido um instrumento de Deus para alcançar vidas e transformar comunidades.
                  </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-lg">
                  <div class="w-32 h-32 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-5xl">👩‍💼</span>
                  </div>
                  <h3 class="text-2xl font-bold text-center text-gray-900 mb-2">Pastora</h3>
                  <p class="text-center text-gray-600 mb-4">Co-fundadora e Líder de Ministérios</p>
                  <p class="text-gray-700">
                    Uma mulher de Deus, dedicada à oração, ao ensino da Palavra e ao cuidado pastoral. 
                    Sua vida é um testemunho de fé, amor e dedicação ao Reino.
                  </p>
                </div>
              </div>

              <h2 class="text-3xl font-bold text-gray-900 mt-10 mb-4">Chamado e Ministério</h2>
              <p class="text-gray-700 mb-4">
                Chamados por Deus desde cedo para o ministério, nossos líderes têm dedicado suas vidas à pregação do Evangelho, 
                ao ensino da Palavra e ao cuidado pastoral. Com uma visão clara de alcançar vidas e fazer discípulos, 
                eles têm liderado o MIR com sabedoria, amor e dedicação.
              </p>

              <h2 class="text-3xl font-bold text-gray-900 mt-8 mb-4">Visão e Propósito</h2>
              <p class="text-gray-700 mb-4">
                A visão de nossos líderes é clara: edificar uma igreja forte, relevante e impactante, que seja luz nas trevas 
                e sal da terra. Uma igreja que adora a Deus em espírito e em verdade, que prega o Evangelho com poder e autoridade, 
                e que demonstra o amor de Cristo através de ações concretas.
              </p>

              <h2 class="text-3xl font-bold text-gray-900 mt-8 mb-4">Formação e Experiência</h2>
              <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>Formação teológica sólida e comprometida com a ortodoxia bíblica</li>
                <li>Anos de experiência no ministério pastoral e evangelístico</li>
                <li>Liderança de conferências, congressos e eventos de avivamento</li>
                <li>Autor de livros e materiais de ensino bíblico</li>
                <li>Mentor e formador de líderes e pastores</li>
                <li>Compromisso com a expansão do Reino de Deus</li>
              </ul>

              <div class="bg-purple-50 border-l-4 border-purple-600 p-6 mt-8">
                <p class="text-lg font-semibold text-purple-900 mb-2">
                  "Apascenta as minhas ovelhas"
                </p>
                <p class="text-purple-700">João 21:17</p>
              </div>

              <div class="mt-10 text-center">
                <p class="text-gray-700 mb-4">
                  Nossos líderes estão sempre disponíveis para oração, aconselhamento e comunhão. 
                  Venha nos visitar e conhecer pessoalmente aqueles que Deus tem usado para edificar este ministério.
                </p>
              </div>
            </div>
          </div>
        `,
        metaDescricao: 'Conheça a liderança do Ministério Internacional Renascer e sua trajetória no Reino de Deus.',
        ativa: true,
        menu: true,
        ordemMenu: 3,
        criadoPor: adminUser._id
      });
      console.log('✅ Página "Presidente do MIR" criada');
    } else {
      console.log('ℹ️  Página "Presidente do MIR" já existe');
    }

    console.log('\n🎉 SEED DE PÁGINAS SOBRE CONCLUÍDO!');
    console.log('\n📄 Páginas criadas:');
    console.log('   • /ministerio - Nosso Ministério');
    console.log('   • /no-que-cremos - No que Cremos');
    console.log('   • /presidente - Presidente do MIR');
    console.log('\nAgora atualize os menus em /admin/menus para associar estas páginas!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

seedPaginasSobre();
