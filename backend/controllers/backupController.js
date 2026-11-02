import Member from '../models/Member.js';
import Donation from '../models/Donation.js';
import Evento from '../models/Evento.js';
import Ministerio from '../models/Ministerio.js';
import PrayerRequest from '../models/PrayerRequest.js';
import Visitor from '../models/Visitor.js';
import Escala from '../models/Escala.js';
import Curso from '../models/Curso.js';
import Aviso from '../models/Aviso.js';
import Album from '../models/Album.js';
import Patrimonio from '../models/Patrimonio.js';
import Mensagem from '../models/Mensagem.js';
import Testemunho from '../models/Testemunho.js';
import Video from '../models/Video.js';
import Audio from '../models/Audio.js';
import Livestream from '../models/Livestream.js';
import Menu from '../models/Menu.js';
import Page from '../models/Page.js';
import Section from '../models/Section.js';
import Theme from '../models/Theme.js';
import ContactInfo from '../models/ContactInfo.js';
import Newsletter from '../models/Newsletter.js';

export const exportarBackupJSON = async (req, res, next) => {
  try {
    const [
      membros,
      doacoes,
      eventos,
      ministerios,
      oracoes,
      visitantes,
      escalas,
      cursos,
      avisos,
      galeria,
      patrimonio,
      mensagens,
      testemunhos,
      videos,
      audios,
      livestreams,
      menus,
      paginas,
      secoes,
      tema,
      contacto,
      newsletter
    ] = await Promise.all([
      Member.find().lean(),
      Donation.find().lean(),
      Evento.find().lean(),
      Ministerio.find().lean(),
      PrayerRequest.find().lean(),
      Visitor.find().lean(),
      Escala.find().lean(),
      Curso.find().lean(),
      Aviso.find().lean(),
      Album.find().lean(),
      Patrimonio.find().lean(),
      Mensagem.find().lean(),
      Testemunho.find().lean(),
      Video.find().lean(),
      Audio.find().lean(),
      Livestream.find().lean(),
      Menu.find().lean(),
      Page.find().lean(),
      Section.find().lean(),
      Theme.findOne().lean(),
      ContactInfo.findOne().lean(),
      Newsletter.find().lean()
    ]);

    res.json({
      sistema: 'Igreja MIR — Sistema Integrado CMS & ERP Eclesiástico',
      exportadoEm: new Date().toISOString(),
      resumo: {
        membros: membros.length,
        movimentosFinanceiros: doacoes.length,
        eventos: eventos.length,
        ministeriosECelulas: ministerios.length,
        pedidosOracao: oracoes.length,
        visitantes: visitantes.length,
        escalas: escalas.length,
        cursos: cursos.length,
        avisos: avisos.length,
        albunsGaleria: galeria.length,
        itensPatrimonio: patrimonio.length
      },
      dados: {
        membros,
        doacoes,
        eventos,
        ministerios,
        oracoes,
        visitantes,
        escalas,
        cursos,
        avisos,
        galeria,
        patrimonio,
        mensagens,
        testemunhos,
        videos,
        audios,
        livestreams,
        menus,
        paginas,
        secoes,
        tema,
        contacto,
        newsletter
      }
    });
  } catch (err) {
    next(err);
  }
};

