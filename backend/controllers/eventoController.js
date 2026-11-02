import Evento from '../models/Evento.js';

export const getEventos = async (req, res, next) => {
  try {
    const eventos = await Evento.find().sort({ dataInicio: 1, ordem: 1 });
    res.json(eventos);
  } catch (err) { next(err); }
};

export const getEventoBySlug = async (req, res, next) => {
  try {
    const evento = await Evento.findOne({ slug: req.params.slug });
    if (!evento) return res.status(404).json({ message: 'Evento não encontrado' });
    res.json(evento);
  } catch (err) { next(err); }
};

export const createEvento = async (req, res, next) => {
  try {
    const evento = new Evento(req.body);
    await evento.save();
    res.status(201).json(evento);
  } catch (err) { next(err); }
};

export const updateEvento = async (req, res, next) => {
  try {
    const evento = await Evento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evento) return res.status(404).json({ message: 'Evento não encontrado' });
    res.json(evento);
  } catch (err) { next(err); }
};

export const deleteEvento = async (req, res, next) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) return res.status(404).json({ message: 'Evento não encontrado' });
    res.json({ message: 'Evento deletado com sucesso' });
  } catch (err) { next(err); }
};

export const inscreverEvento = async (req, res, next) => {
  try {
    const { nome, email, telefone, acompanhantes, observacoes } = req.body;
    if (!nome || !telefone) {
      return res.status(400).json({ message: 'Nome e telefone são obrigatórios para a inscrição.' });
    }

    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    if (evento.inscricaoAberta === false) {
      return res.status(400).json({ message: 'As inscrições para este evento estão encerradas.' });
    }

    const numAcompanhantes = Math.max(0, Number(acompanhantes) || 0);
    const totalInscritosAtuais = (evento.inscritos || []).reduce(
      (acc, item) => acc + 1 + (item.acompanhantes || 0),
      0
    );

    if (evento.capacidade > 0 && totalInscritosAtuais + 1 + numAcompanhantes > evento.capacidade) {
      return res.status(400).json({
        message: 'Não há vagas suficientes disponíveis para a quantidade solicitada.'
      });
    }

    evento.inscritos.push({
      nome: String(nome).trim(),
      email: email ? String(email).trim() : '',
      telefone: String(telefone).trim(),
      acompanhantes: numAcompanhantes,
      observacoes: observacoes ? String(observacoes).trim() : '',
      dataInscricao: new Date()
    });

    await evento.save();
    res.status(201).json({
      message: 'Inscrição confirmada com sucesso!',
      evento
    });
  } catch (err) {
    next(err);
  }
};

export const removerInscritoEvento = async (req, res, next) => {
  try {
    const { id, inscritoId } = req.params;
    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    evento.inscritos = (evento.inscritos || []).filter(
      (i) => i._id.toString() !== inscritoId
    );
    await evento.save();
    res.json(evento);
  } catch (err) {
    next(err);
  }
};
