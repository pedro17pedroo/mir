import Escala from '../models/Escala.js';

export const getEscalas = async (req, res, next) => {
  try {
    const { publicada } = req.query;
    const filter = {};
    if (publicada !== undefined) filter.publicada = publicada === 'true';

    const escalas = await Escala.find(filter).sort({ dataCulto: 1 });
    res.json(escalas);
  } catch (err) {
    next(err);
  }
};

export const createEscala = async (req, res, next) => {
  try {
    const escala = new Escala(req.body);
    await escala.save();
    res.status(201).json(escala);
  } catch (err) {
    next(err);
  }
};

export const updateEscala = async (req, res, next) => {
  try {
    const escala = await Escala.findById(req.params.id);
    if (!escala) {
      return res.status(404).json({ message: 'Escala não encontrada' });
    }
    Object.assign(escala, req.body);
    await escala.save();
    res.json(escala);
  } catch (err) {
    next(err);
  }
};

export const deleteEscala = async (req, res, next) => {
  try {
    const escala = await Escala.findByIdAndDelete(req.params.id);
    if (!escala) {
      return res.status(404).json({ message: 'Escala não encontrada' });
    }
    res.json({ message: 'Escala removida com sucesso' });
  } catch (err) {
    next(err);
  }
};

