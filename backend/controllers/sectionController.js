import Section from '../models/Section.js';

export const getSections = async (req, res, next) => {
  try {
    const { tipo } = req.query;
    const filter = {};
    if (tipo === 'carrossel' || tipo === 'hero') {
      filter.tipo = { $in: ['carrossel', 'hero'] };
    } else if (typeof tipo === 'string' && tipo) {
      filter.tipo = tipo;
    }
    const sections = await Section.find(filter).sort({ ordem: 1, createdAt: -1 });
    res.json(sections);
  } catch (err) { next(err); }
};

export const createSection = async (req, res, next) => {
  try {
    const section = new Section(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (err) { next(err); }
};

export const updateSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!section) return res.status(404).json({ message: 'Seção não encontrada' });
    res.json(section);
  } catch (err) { next(err); }
};

export const deleteSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ message: 'Seção não encontrada' });
    res.json({ message: 'Seção deletada com sucesso' });
  } catch (err) { next(err); }
};
