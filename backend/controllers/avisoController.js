import Aviso from '../models/Aviso.js';

export const getAvisos = async (req, res, next) => {
  try {
    const { ativo } = req.query;
    const filter = {};
    if (ativo !== undefined) filter.ativo = ativo === 'true';

    const avisos = await Aviso.find(filter).sort({ fixado: -1, createdAt: -1 });
    res.json(avisos);
  } catch (err) {
    next(err);
  }
};

export const createAviso = async (req, res, next) => {
  try {
    const aviso = new Aviso(req.body);
    await aviso.save();
    res.status(201).json(aviso);
  } catch (err) {
    next(err);
  }
};

export const updateAviso = async (req, res, next) => {
  try {
    const aviso = await Aviso.findById(req.params.id);
    if (!aviso) {
      return res.status(404).json({ message: 'Aviso não encontrado' });
    }
    Object.assign(aviso, req.body);
    await aviso.save();
    res.json(aviso);
  } catch (err) {
    next(err);
  }
};

export const deleteAviso = async (req, res, next) => {
  try {
    const aviso = await Aviso.findByIdAndDelete(req.params.id);
    if (!aviso) {
      return res.status(404).json({ message: 'Aviso não encontrado' });
    }
    res.json({ message: 'Aviso removido com sucesso' });
  } catch (err) {
    next(err);
  }
};

