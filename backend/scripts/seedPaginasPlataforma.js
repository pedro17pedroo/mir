import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Page from '../models/Page.js';
import User from '../models/User.js';

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

const seedPaginasPlataforma = async () => {
  try {
    console.log('\n🌱 Iniciando seed das páginas da Plataforma de Ensino...\n');

    // Buscar usuário admin
    const admin = await User.findOne({ email: 'admin@igrejamir.com' });
    if (!admin) {
      console.error('❌ Usuário admin não encontrado. Execute o script createAdminUser.js primeiro.');
      process.exit(1);
    }
    console.log('✅ Usuário admin encontrado');

    // Deletar páginas existentes da plataforma
    await Page.deleteMany({ 
      slug: { 
        $in: [
          'conferencia-fe',
          'escola-fundacao',
          'conferencia-ministros',
          'conferencia-mulheres',
          'conferencia-jovens',
          'mulheres-transformadas',
          'reis-sacerdotes'
        ]
      }
    });
    console.log('🗑️  Páginas antigas da plataforma removidas');

    // 1. Conferência de Fé
    await Page.create({
      titulo: 'Conferência de Fé',
      slug: 'conferencia-fe',
      criadoPor: admin._id,
      conteudo: `
        <h2>Conferência de Fé</h2>
        <p class="lead">Um encontro poderoso para fortalecer sua fé e experimentar o mover de Deus.</p>
        
        <h3>Sobre a Conferência</h3>
        <p>A Conferência de Fé é um evento anual que reúne milhares de pessoas em busca de renovação espiritual, ensino bíblico profundo e experiências transformadoras com Deus. Durante três dias intensos, você será desafiado a crescer na fé e a viver uma vida de vitória.</p>
        
        <h3>O que esperar</h3>
        <ul>
          <li><strong>Pregações Poderosas:</strong> Mensagens inspiradoras que edificam e transformam vidas</li>
          <li><strong>Adoração Intensa:</strong> Momentos de louvor e adoração que levam à presença de Deus</li>
          <li><strong>Ministração Profética:</strong> Palavras de direção e encorajamento para sua vida</li>
          <li><strong>Comunhão:</strong> Oportunidade de conhecer pessoas de fé de todo o país</li>
          <li><strong>Workshops:</strong> Sessões práticas sobre vida cristã e ministério</li>
        </ul>
        
        <h3>Temas Abordados</h3>
        <ul>
          <li>Fé que move montanhas</li>
          <li>Autoridade espiritual do crente</li>
          <li>Vida de oração e jejum</li>
          <li>Dons espirituais e ministérios</li>
          <li>Batalha espiritual e vitória</li>
        </ul>
        
        <h3>Próxima Edição</h3>
        <p>Fique atento às datas da próxima Conferência de Fé. Não perca esta oportunidade de ter sua vida transformada!</p>
        
        <div class="bg-purple-50 p-6 rounded-lg my-6">
          <h4 class="text-purple-900 font-bold mb-2">Inscreva-se</h4>
          <p>Entre em contato conosco para mais informações sobre inscrições e valores.</p>
        </div>
      `,
      metaDescricao: 'Conferência de Fé - Um encontro poderoso para fortalecer sua fé e experimentar o mover de Deus',
      ativa: true
    });
    console.log('✅ Conferência de Fé criada');

    // 2. Escola de Fundação
    await Page.create({
      titulo: 'Escola de Fundação',
      slug: 'escola-fundacao',
      criadoPor: admin._id,
      conteudo: `
        <h2>Escola de Fundação</h2>
        <p class="lead">Construa uma base sólida para sua vida cristã e ministério.</p>
        
        <h3>Sobre a Escola</h3>
        <p>A Escola de Fundação é um programa de formação bíblica e ministerial que visa equipar os santos para o serviço cristão. Com duração de 6 meses, o curso oferece uma base teológica sólida e prática para quem deseja crescer no conhecimento de Deus e servir com excelência.</p>
        
        <h3>Estrutura do Curso</h3>
        <ul>
          <li><strong>Duração:</strong> 6 meses (aulas semanais)</li>
          <li><strong>Formato:</strong> Presencial e online</li>
          <li><strong>Carga Horária:</strong> 120 horas</li>
          <li><strong>Certificado:</strong> Ao final do curso</li>
        </ul>
        
        <h3>Módulos de Ensino</h3>
        <ol>
          <li><strong>Fundamentos da Fé Cristã</strong>
            <ul>
              <li>Doutrina da Salvação</li>
              <li>Batismo e Santa Ceia</li>
              <li>A Trindade</li>
            </ul>
          </li>
          <li><strong>Vida Cristã Prática</strong>
            <ul>
              <li>Oração e Jejum</li>
              <li>Leitura Bíblica</li>
              <li>Santidade e Caráter</li>
            </ul>
          </li>
          <li><strong>Dons e Ministérios</strong>
            <ul>
              <li>Dons Espirituais</li>
              <li>Ministérios na Igreja</li>
              <li>Chamado e Vocação</li>
            </ul>
          </li>
          <li><strong>Evangelismo e Missões</strong>
            <ul>
              <li>Compartilhando a Fé</li>
              <li>Discipulado</li>
              <li>Visão Missionária</li>
            </ul>
          </li>
        </ol>
        
        <h3>Para Quem é Este Curso?</h3>
        <ul>
          <li>Novos convertidos que desejam crescer na fé</li>
          <li>Cristãos que querem aprofundar seu conhecimento bíblico</li>
          <li>Líderes em formação</li>
          <li>Membros que desejam servir com excelência</li>
        </ul>
        
        <div class="bg-blue-50 p-6 rounded-lg my-6">
          <h4 class="text-blue-900 font-bold mb-2">Próxima Turma</h4>
          <p>As inscrições para a próxima turma estarão abertas em breve. Entre em contato para mais informações.</p>
        </div>
      `,
      metaDescricao: 'Escola de Fundação - Construa uma base sólida para sua vida cristã e ministério',
      ativa: true
    });
    console.log('✅ Escola de Fundação criada');

    // 3. Conferência de Ministros
    await Page.create({
      titulo: 'Conferência de Ministros',
      slug: 'conferencia-ministros',
      criadoPor: admin._id,
      conteudo: `
        <h2>Conferência de Ministros</h2>
        <p class="lead">Capacitação e renovação para líderes e ministros do evangelho.</p>
        
        <h3>Sobre a Conferência</h3>
        <p>A Conferência de Ministros é um evento exclusivo para pastores, líderes, missionários e obreiros que desejam ser renovados, capacitados e inspirados para o ministério. É um tempo de comunhão, aprendizado e fortalecimento espiritual.</p>
        
        <h3>Público-Alvo</h3>
        <ul>
          <li>Pastores e pastoras</li>
          <li>Líderes de ministérios</li>
          <li>Missionários</li>
          <li>Obreiros e cooperadores</li>
          <li>Seminaristas e estudantes de teologia</li>
        </ul>
        
        <h3>Programação</h3>
        <ul>
          <li><strong>Plenárias:</strong> Mensagens específicas para líderes</li>
          <li><strong>Workshops:</strong> Temas práticos de liderança e gestão ministerial</li>
          <li><strong>Painéis:</strong> Discussões sobre desafios contemporâneos do ministério</li>
          <li><strong>Momentos de Oração:</strong> Intercessão e ministração para líderes</li>
          <li><strong>Networking:</strong> Oportunidade de conhecer outros ministros</li>
        </ul>
        
        <h3>Temas Abordados</h3>
        <ul>
          <li>Liderança servidora e eficaz</li>
          <li>Saúde emocional do líder</li>
          <li>Gestão de conflitos na igreja</li>
          <li>Pregação expositiva</li>
          <li>Discipulado intencional</li>
          <li>Plantação de igrejas</li>
          <li>Família do ministro</li>
          <li>Ética ministerial</li>
        </ul>
        
        <h3>Palestrantes</h3>
        <p>Contamos com a participação de pastores e líderes experientes, reconhecidos nacional e internacionalmente por sua contribuição ao Reino de Deus.</p>
        
        <div class="bg-green-50 p-6 rounded-lg my-6">
          <h4 class="text-green-900 font-bold mb-2">Inscrições</h4>
          <p>Vagas limitadas. Entre em contato para garantir sua participação na próxima edição.</p>
        </div>
      `,
      metaDescricao: 'Conferência de Ministros - Capacitação e renovação para líderes e ministros do evangelho',
      ativa: true
    });
    console.log('✅ Conferência de Ministros criada');

    // 4. Conferência de Mulheres
    await Page.create({
      titulo: 'Conferência de Mulheres',
      slug: 'conferencia-mulheres',
      criadoPor: admin._id,
      conteudo: `
        <h2>Conferência de Mulheres</h2>
        <p class="lead">Um encontro especial para mulheres de fé, propósito e poder.</p>
        
        <h3>Sobre a Conferência</h3>
        <p>A Conferência de Mulheres é um evento transformador que reúne mulheres de todas as idades para celebrar a identidade feminina em Cristo, fortalecer relacionamentos e descobrir o propósito de Deus para suas vidas. É um tempo de cura, restauração e empoderamento espiritual.</p>
        
        <h3>O que Você Vai Experimentar</h3>
        <ul>
          <li><strong>Ministração Específica:</strong> Mensagens direcionadas às necessidades e desafios das mulheres</li>
          <li><strong>Adoração Profunda:</strong> Momentos de intimidade com Deus</li>
          <li><strong>Cura Interior:</strong> Ministração de libertação e restauração emocional</li>
          <li><strong>Comunhão Feminina:</strong> Conexão com outras mulheres de fé</li>
          <li><strong>Workshops Práticos:</strong> Temas relevantes para a vida da mulher cristã</li>
        </ul>
        
        <h3>Temas Abordados</h3>
        <ul>
          <li>Identidade em Cristo</li>
          <li>Mulher virtuosa do século XXI</li>
          <li>Relacionamentos saudáveis</li>
          <li>Maternidade e família</li>
          <li>Propósito e chamado</li>
          <li>Beleza interior e exterior</li>
          <li>Liderança feminina</li>
          <li>Cura de feridas emocionais</li>
        </ul>
        
        <h3>Workshops Especiais</h3>
        <ul>
          <li>Mulher e Carreira</li>
          <li>Finanças para Mulheres</li>
          <li>Saúde e Bem-estar</li>
          <li>Criação de Filhos</li>
          <li>Casamento Feliz</li>
          <li>Solteira e Completa</li>
        </ul>
        
        <h3>Para Todas as Mulheres</h3>
        <p>Seja você solteira, casada, mãe, jovem ou madura, esta conferência é para você! Venha experimentar o amor de Deus e descobrir o plano maravilhoso que Ele tem para sua vida.</p>
        
        <div class="bg-pink-50 p-6 rounded-lg my-6">
          <h4 class="text-pink-900 font-bold mb-2">Próximo Encontro</h4>
          <p>Não perca a próxima Conferência de Mulheres. Inscreva-se e traga suas amigas!</p>
        </div>
      `,
      metaDescricao: 'Conferência de Mulheres - Um encontro especial para mulheres de fé, propósito e poder',
      ativa: true
    });
    console.log('✅ Conferência de Mulheres criada');

    // 5. Conferência dos Jovens
    await Page.create({
      titulo: 'Conferência dos Jovens',
      slug: 'conferencia-jovens',
      criadoPor: admin._id,
      conteudo: `
        <h2>Conferência dos Jovens</h2>
        <p class="lead">Uma geração radical, apaixonada por Jesus e comprometida com o Reino.</p>
        
        <h3>Sobre a Conferência</h3>
        <p>A Conferência dos Jovens é o maior evento jovem do ano! Três dias de adoração intensa, pregações impactantes, atividades dinâmicas e muita comunhão. É o lugar onde jovens de 15 a 30 anos se encontram para buscar a Deus, fazer amizades e descobrir seu propósito.</p>
        
        <h3>Por Que Participar?</h3>
        <ul>
          <li><strong>Adoração Poderosa:</strong> Bandas e ministros de louvor que levam você à presença de Deus</li>
          <li><strong>Pregações Relevantes:</strong> Mensagens que falam a linguagem da sua geração</li>
          <li><strong>Atividades Radicais:</strong> Esportes, gincanas e desafios</li>
          <li><strong>Amizades Verdadeiras:</strong> Conheça jovens de todo o país</li>
          <li><strong>Experiências com Deus:</strong> Momentos que marcam para sempre</li>
        </ul>
        
        <h3>Programação</h3>
        <ul>
          <li><strong>Manhã:</strong> Workshops e atividades em grupos</li>
          <li><strong>Tarde:</strong> Esportes, jogos e recreação</li>
          <li><strong>Noite:</strong> Cultos com adoração e pregação</li>
          <li><strong>Madrugada:</strong> Vigílias de oração (opcional)</li>
        </ul>
        
        <h3>Temas</h3>
        <ul>
          <li>Identidade em Cristo</li>
          <li>Namoro e relacionamentos</li>
          <li>Propósito e vocação</li>
          <li>Redes sociais e fé</li>
          <li>Santidade na geração Z</li>
          <li>Dons espirituais</li>
          <li>Evangelismo criativo</li>
          <li>Liderança jovem</li>
        </ul>
        
        <h3>Workshops Especiais</h3>
        <ul>
          <li>Música e Adoração</li>
          <li>Mídia e Comunicação</li>
          <li>Empreendedorismo Cristão</li>
          <li>Missões Transculturais</li>
          <li>Arte e Criatividade</li>
          <li>Esportes e Fé</li>
        </ul>
        
        <h3>Estrutura</h3>
        <ul>
          <li><strong>Local:</strong> Acampamento ou centro de convenções</li>
          <li><strong>Duração:</strong> 3 dias (sexta a domingo)</li>
          <li><strong>Hospedagem:</strong> Inclusa (alojamentos coletivos)</li>
          <li><strong>Alimentação:</strong> Todas as refeições inclusas</li>
        </ul>
        
        <div class="bg-yellow-50 p-6 rounded-lg my-6">
          <h4 class="text-yellow-900 font-bold mb-2">Inscreva-se Já!</h4>
          <p>Vagas limitadas! Garanta sua vaga na próxima Conferência dos Jovens e viva uma experiência inesquecível.</p>
        </div>
      `,
      metaDescricao: 'Conferência dos Jovens - Uma geração radical, apaixonada por Jesus e comprometida com o Reino',
      ativa: true
    });
    console.log('✅ Conferência dos Jovens criada');

    // 6. Mulheres Transformadas
    await Page.create({
      titulo: 'Mulheres Transformadas',
      slug: 'mulheres-transformadas',
      criadoPor: admin._id,
      conteudo: `
        <h2>Mulheres Transformadas</h2>
        <p class="lead">Um ministério dedicado à transformação integral da mulher cristã.</p>
        
        <h3>Sobre o Ministério</h3>
        <p>Mulheres Transformadas é um ministério contínuo que visa o desenvolvimento espiritual, emocional e social das mulheres da igreja. Através de encontros mensais, células, mentorias e eventos especiais, buscamos ver cada mulher alcançar seu potencial máximo em Cristo.</p>
        
        <h3>Nossos Pilares</h3>
        <ul>
          <li><strong>Transformação Espiritual:</strong> Crescimento na fé e intimidade com Deus</li>
          <li><strong>Cura Emocional:</strong> Restauração de feridas e traumas do passado</li>
          <li><strong>Desenvolvimento Pessoal:</strong> Capacitação em diversas áreas da vida</li>
          <li><strong>Comunidade:</strong> Relacionamentos saudáveis e apoio mútuo</li>
        </ul>
        
        <h3>Atividades Regulares</h3>
        <ul>
          <li><strong>Encontros Mensais:</strong> Primeira sexta-feira de cada mês</li>
          <li><strong>Células de Mulheres:</strong> Grupos pequenos semanais</li>
          <li><strong>Mentoria:</strong> Acompanhamento individual</li>
          <li><strong>Retiros Trimestrais:</strong> Finais de semana de imersão</li>
          <li><strong>Projetos Sociais:</strong> Ações de impacto na comunidade</li>
        </ul>
        
        <h3>Áreas de Atuação</h3>
        <ol>
          <li><strong>Vida Espiritual</strong>
            <ul>
              <li>Estudo bíblico</li>
              <li>Oração e jejum</li>
              <li>Dons espirituais</li>
            </ul>
          </li>
          <li><strong>Relacionamentos</strong>
            <ul>
              <li>Casamento</li>
              <li>Família</li>
              <li>Amizades</li>
            </ul>
          </li>
          <li><strong>Desenvolvimento Pessoal</strong>
            <ul>
              <li>Autoestima</li>
              <li>Liderança</li>
              <li>Comunicação</li>
            </ul>
          </li>
          <li><strong>Vida Prática</strong>
            <ul>
              <li>Finanças</li>
              <li>Saúde</li>
              <li>Carreira</li>
            </ul>
          </li>
        </ol>
        
        <h3>Grupos Específicos</h3>
        <ul>
          <li><strong>Jovens Mulheres:</strong> 18 a 30 anos</li>
          <li><strong>Mulheres em Ação:</strong> 31 a 50 anos</li>
          <li><strong>Mulheres de Sabedoria:</strong> Acima de 50 anos</li>
          <li><strong>Mães:</strong> Grupo específico para mães</li>
          <li><strong>Solteiras:</strong> Grupo para mulheres solteiras</li>
        </ul>
        
        <h3>Projetos Especiais</h3>
        <ul>
          <li>Bazar Solidário</li>
          <li>Visitas a Orfanatos</li>
          <li>Apoio a Gestantes</li>
          <li>Combate à Violência Doméstica</li>
          <li>Alfabetização de Adultos</li>
        </ul>
        
        <div class="bg-purple-50 p-6 rounded-lg my-6">
          <h4 class="text-purple-900 font-bold mb-2">Faça Parte!</h4>
          <p>Venha fazer parte do ministério Mulheres Transformadas. Participe dos nossos encontros e seja transformada!</p>
        </div>
      `,
      metaDescricao: 'Mulheres Transformadas - Um ministério dedicado à transformação integral da mulher cristã',
      ativa: true
    });
    console.log('✅ Mulheres Transformadas criada');

    // 7. Reis e Sacerdotes
    await Page.create({
      titulo: 'Reis e Sacerdotes',
      slug: 'reis-sacerdotes',
      criadoPor: admin._id,
      conteudo: `
        <h2>Reis e Sacerdotes</h2>
        <p class="lead">Formando homens de Deus para liderança e serviço no Reino.</p>
        
        <h3>Sobre o Ministério</h3>
        <p>Reis e Sacerdotes é um ministério masculino que visa formar homens segundo o coração de Deus, capacitando-os para serem líderes espirituais em suas famílias, igrejas e sociedade. Baseado em Apocalipse 1:6, buscamos desenvolver o caráter real (liderança) e sacerdotal (adoração e intercessão) em cada homem.</p>
        
        <h3>Nossa Visão</h3>
        <p>Formar uma geração de homens que sejam:</p>
        <ul>
          <li><strong>Reis:</strong> Líderes íntegros, sábios e corajosos</li>
          <li><strong>Sacerdotes:</strong> Adoradores, intercessores e servos</li>
          <li><strong>Guerreiros:</strong> Valentes na batalha espiritual</li>
          <li><strong>Pais:</strong> Exemplos para suas famílias</li>
          <li><strong>Cidadãos:</strong> Sal e luz na sociedade</li>
        </ul>
        
        <h3>Atividades</h3>
        <ul>
          <li><strong>Encontros Mensais:</strong> Primeiro sábado de cada mês</li>
          <li><strong>Células Masculinas:</strong> Grupos pequenos semanais</li>
          <li><strong>Acampamentos:</strong> Retiros trimestrais</li>
          <li><strong>Projetos Sociais:</strong> Ações na comunidade</li>
          <li><strong>Esportes:</strong> Futebol, vôlei e outras atividades</li>
        </ul>
        
        <h3>Pilares de Formação</h3>
        <ol>
          <li><strong>Caráter Cristão</strong>
            <ul>
              <li>Integridade</li>
              <li>Honestidade</li>
              <li>Fidelidade</li>
              <li>Humildade</li>
            </ul>
          </li>
          <li><strong>Vida Espiritual</strong>
            <ul>
              <li>Oração e jejum</li>
              <li>Estudo bíblico</li>
              <li>Adoração</li>
              <li>Batalha espiritual</li>
            </ul>
          </li>
          <li><strong>Liderança</strong>
            <ul>
              <li>Liderança servidora</li>
              <li>Tomada de decisões</li>
              <li>Gestão de conflitos</li>
              <li>Visão e estratégia</li>
            </ul>
          </li>
          <li><strong>Relacionamentos</strong>
            <ul>
              <li>Casamento</li>
              <li>Paternidade</li>
              <li>Amizades</li>
              <li>Mentoria</li>
            </ul>
          </li>
          <li><strong>Vida Prática</strong>
            <ul>
              <li>Finanças</li>
              <li>Carreira</li>
              <li>Saúde</li>
              <li>Gestão do tempo</li>
            </ul>
          </li>
        </ol>
        
        <h3>Temas dos Encontros</h3>
        <ul>
          <li>O homem segundo o coração de Deus</li>
          <li>Liderança masculina na família</li>
          <li>Paternidade responsável</li>
          <li>Pureza sexual e santidade</li>
          <li>Trabalho e vocação</li>
          <li>Amizades masculinas saudáveis</li>
          <li>Homem de oração</li>
          <li>Guerreiro espiritual</li>
        </ul>
        
        <h3>Grupos por Faixa Etária</h3>
        <ul>
          <li><strong>Jovens Guerreiros:</strong> 18 a 30 anos</li>
          <li><strong>Homens de Valor:</strong> 31 a 50 anos</li>
          <li><strong>Homens de Sabedoria:</strong> Acima de 50 anos</li>
        </ul>
        
        <h3>Projetos Especiais</h3>
        <ul>
          <li>Café da Manhã com Deus (mensal)</li>
          <li>Churrasco dos Homens (bimestral)</li>
          <li>Acampamento Anual</li>
          <li>Projeto Pai Presente</li>
          <li>Mentoria de Jovens</li>
          <li>Ações Sociais</li>
        </ul>
        
        <div class="bg-blue-50 p-6 rounded-lg my-6">
          <h4 class="text-blue-900 font-bold mb-2">Junte-se a Nós!</h4>
          <p>Venha fazer parte do ministério Reis e Sacerdotes. Seja um homem de Deus, preparado para liderar e servir!</p>
        </div>
      `,
      metaDescricao: 'Reis e Sacerdotes - Formando homens de Deus para liderança e serviço no Reino',
      ativa: true
    });
    console.log('✅ Reis e Sacerdotes criada');

    console.log('\n🎉 SEED DAS PÁGINAS DA PLATAFORMA CONCLUÍDO!');
    console.log('\n📄 Páginas criadas:');
    console.log('   1. Conferência de Fé');
    console.log('   2. Escola de Fundação');
    console.log('   3. Conferência de Ministros');
    console.log('   4. Conferência de Mulheres');
    console.log('   5. Conferência dos Jovens');
    console.log('   6. Mulheres Transformadas');
    console.log('   7. Reis e Sacerdotes');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
};

connectDB().then(seedPaginasPlataforma);
