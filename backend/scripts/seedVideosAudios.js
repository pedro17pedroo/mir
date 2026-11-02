import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from '../models/Video.js';
import Audio from '../models/Audio.js';

dotenv.config();

const seedVideosAudios = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes
    await Video.deleteMany({});
    await Audio.deleteMany({});
    console.log('🗑️  Dados antigos removidos');

    // Vídeos de exemplo
    const videos = [
      {
        titulo: 'O Poder da Fé - Pregação Completa',
        descricao: '<p>Uma mensagem poderosa sobre como a fé pode transformar vidas e mover montanhas. Descubra os princípios bíblicos que fortalecem sua fé.</p>',
        tipoVideo: 'youtube',
        youtubeId: 'dQw4w9WgXcQ', // Substitua por IDs reais
        pregador: 'Pastor João Silva',
        categoria: 'pregacao',
        tags: ['fé', 'transformação', 'poder'],
        duracao: '45:30',
        destaque: true,
        status: 'ativo'
      },
      {
        titulo: 'Ensino sobre Oração Eficaz',
        descricao: '<p>Aprenda os segredos de uma vida de oração que traz resultados. Baseado em princípios bíblicos sólidos.</p>',
        tipoVideo: 'youtube',
        youtubeId: 'dQw4w9WgXcQ',
        pregador: 'Pastora Maria Santos',
        categoria: 'ensino',
        tags: ['oração', 'ensino', 'vida cristã'],
        duracao: '38:15',
        destaque: true,
        status: 'ativo'
      },
      {
        titulo: 'Louvor e Adoração - Culto Especial',
        descricao: '<p>Momentos de louvor e adoração do nosso culto especial. Deixe-se envolver pela presença de Deus.</p>',
        tipoVideo: 'youtube',
        youtubeId: 'dQw4w9WgXcQ',
        pregador: 'Ministério de Louvor MIR',
        categoria: 'louvor',
        tags: ['louvor', 'adoração', 'culto'],
        duracao: '52:00',
        destaque: false,
        status: 'ativo'
      },
      {
        titulo: 'Testemunho de Cura e Libertação',
        descricao: '<p>Um testemunho emocionante de como Deus transformou uma vida através de cura e libertação.</p>',
        tipoVideo: 'youtube',
        youtubeId: 'dQw4w9WgXcQ',
        pregador: 'Ana Paula Costa',
        categoria: 'testemunho',
        tags: ['testemunho', 'cura', 'libertação'],
        duracao: '15:45',
        destaque: false,
        status: 'ativo'
      },
      {
        titulo: 'Conferência de Fé 2026 - Dia 1',
        descricao: '<p>Primeiro dia da Conferência de Fé 2026. Mensagens poderosas e momentos de avivamento.</p>',
        tipoVideo: 'youtube',
        youtubeId: 'dQw4w9WgXcQ',
        pregador: 'Diversos Pregadores',
        categoria: 'evento',
        tags: ['conferência', 'fé', 'avivamento'],
        duracao: '2:15:30',
        destaque: false,
        status: 'ativo'
      },
      {
        titulo: 'A Importância da Família na Igreja',
        descricao: '<p>Mensagem sobre o papel fundamental da família no plano de Deus e na igreja.</p>',
        tipoVideo: 'youtube',
        youtubeId: 'dQw4w9WgXcQ',
        pregador: 'Pastor Carlos Mendes',
        categoria: 'pregacao',
        tags: ['família', 'igreja', 'relacionamentos'],
        duracao: '42:20',
        destaque: false,
        status: 'ativo'
      }
    ];

    // Áudios de exemplo
    const audios = [
      {
        titulo: 'Pregação: Vencendo os Gigantes da Vida',
        descricao: '<p>Uma mensagem inspiradora sobre como enfrentar e vencer os desafios da vida com fé e coragem.</p>',
        audioUrl: '/audios/pregacao-gigantes.mp3', // Substitua por URLs reais
        pregador: 'Pastor João Silva',
        categoria: 'pregacao',
        tags: ['vitória', 'fé', 'desafios'],
        duracao: '35:20',
        destaque: true,
        status: 'ativo'
      },
      {
        titulo: 'Ensino: Os Frutos do Espírito',
        descricao: '<p>Estudo profundo sobre os frutos do Espírito Santo e como desenvolvê-los em nossa vida.</p>',
        audioUrl: '/audios/ensino-frutos.mp3',
        pregador: 'Pastora Maria Santos',
        categoria: 'ensino',
        tags: ['espírito santo', 'frutos', 'caráter'],
        duracao: '28:45',
        destaque: true,
        status: 'ativo'
      },
      {
        titulo: 'Devocional Matinal - Dia 1',
        descricao: '<p>Devocional para começar o dia com Deus. Reflexões e oração.</p>',
        audioUrl: '/audios/devocional-dia1.mp3',
        pregador: 'Pastor André Lima',
        categoria: 'devocional',
        tags: ['devocional', 'manhã', 'oração'],
        duracao: '12:30',
        destaque: false,
        status: 'ativo'
      },
      {
        titulo: 'Podcast MIR - Episódio 1: Propósito de Vida',
        descricao: '<p>Primeiro episódio do nosso podcast falando sobre descobrir e viver seu propósito.</p>',
        audioUrl: '/audios/podcast-ep1.mp3',
        pregador: 'Equipe MIR',
        categoria: 'podcast',
        tags: ['podcast', 'propósito', 'vida'],
        duracao: '45:00',
        destaque: false,
        status: 'ativo'
      },
      {
        titulo: 'Pregação: O Amor de Deus',
        descricao: '<p>Mensagem sobre o amor incondicional de Deus por nós.</p>',
        audioUrl: '/audios/pregacao-amor.mp3',
        pregador: 'Pastora Ana Paula',
        categoria: 'pregacao',
        tags: ['amor', 'deus', 'graça'],
        duracao: '40:15',
        destaque: false,
        status: 'ativo'
      },
      {
        titulo: 'Ensino: Princípios de Prosperidade',
        descricao: '<p>Ensino bíblico sobre prosperidade integral: espiritual, emocional e financeira.</p>',
        audioUrl: '/audios/ensino-prosperidade.mp3',
        pregador: 'Pastor Carlos Mendes',
        categoria: 'ensino',
        tags: ['prosperidade', 'finanças', 'bênçãos'],
        duracao: '33:50',
        destaque: false,
        status: 'ativo'
      }
    ];

    // Inserir vídeos
    let videosInseridos = 0;
    for (const videoData of videos) {
      const video = new Video(videoData);
      await video.save();
      videosInseridos++;
    }
    console.log(`✅ ${videosInseridos} vídeos criados`);

    // Inserir áudios
    let audiosInseridos = 0;
    for (const audioData of audios) {
      const audio = new Audio(audioData);
      await audio.save();
      audiosInseridos++;
    }
    console.log(`✅ ${audiosInseridos} áudios criados`);

    console.log('\n📊 Resumo:');
    console.log(`   Vídeos: ${videosInseridos}`);
    console.log(`   Áudios: ${audiosInseridos}`);
    console.log('\n🎉 Seed concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');
  }
};

seedVideosAudios();
