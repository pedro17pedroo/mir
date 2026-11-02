import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Evento from '../models/Evento.js';

dotenv.config();

const addEventoComLocalizacao = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Criar evento de exemplo com localização
    const evento = new Evento({
      titulo: 'Conferência de Fé 2026',
      descricao: `
        <p>Participe da maior Conferência de Fé do ano! Um evento transformador com pregações poderosas, 
        momentos de adoração intensos e experiências sobrenaturais.</p>
        
        <h3>Programação:</h3>
        <ul>
          <li><strong>19h00:</strong> Abertura e Louvor</li>
          <li><strong>20h00:</strong> Pregação da Palavra</li>
          <li><strong>21h30:</strong> Ministração e Oração</li>
        </ul>
        
        <p>Não perca esta oportunidade de crescer na fé e experimentar o mover de Deus!</p>
      `,
      dataInicio: new Date('2026-03-15T19:00:00'),
      dataFim: new Date('2026-03-15T22:00:00'),
      horarioInicio: '19:00',
      horarioFim: '22:00',
      local: 'Igreja MIR - Sede Central',
      localizacao: {
        latitude: -23.5505,
        longitude: -46.6333,
        endereco: 'Avenida Paulista, 1000 - Bela Vista, São Paulo - SP, Brasil'
      },
      organizador: 'Ministério Internacional Renascer',
      imagem: '/462935567_850783850457170_4032022947113434073_n.jpg',
      destaque: true,
      status: 'ativo'
    });

    await evento.save();
    console.log('✅ Evento criado com sucesso!');
    console.log('📍 Localização:', evento.localizacao);
    console.log('🔗 Slug:', evento.slug);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');
  }
};

addEventoComLocalizacao();
