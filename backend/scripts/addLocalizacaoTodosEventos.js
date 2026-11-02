import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Evento from '../models/Evento.js';

dotenv.config();

const addLocalizacaoTodosEventos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Buscar todos os eventos sem localização
    const eventos = await Evento.find({
      $or: [
        { localizacao: { $exists: false } },
        { 'localizacao.latitude': { $exists: false } }
      ]
    });

    console.log(`📍 Encontrados ${eventos.length} eventos sem localização`);

    // Localização padrão (Av. Paulista, São Paulo)
    const localizacaoPadrao = {
      latitude: -23.5505,
      longitude: -46.6333,
      endereco: 'Avenida Paulista, 1000 - Bela Vista, São Paulo - SP, Brasil'
    };

    for (const evento of eventos) {
      evento.localizacao = localizacaoPadrao;
      
      // Adicionar campos faltantes se necessário
      if (!evento.horarioInicio) evento.horarioInicio = '19:00';
      if (!evento.horarioFim) evento.horarioFim = '21:00';
      if (!evento.organizador) evento.organizador = 'Ministério Internacional Renascer';
      if (evento.status === undefined) evento.status = 'ativo';
      if (evento.destaque === undefined) evento.destaque = false;
      
      await evento.save();
      console.log(`✅ Localização adicionada: ${evento.titulo}`);
    }

    console.log(`\n🎉 ${eventos.length} eventos atualizados com sucesso!`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');
  }
};

addLocalizacaoTodosEventos();
