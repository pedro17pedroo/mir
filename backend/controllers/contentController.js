import Content from '../models/Content.js';

export const getContents = async (req, res, next) => {
  try {
    const { categoria } = req.query;
    const filter = categoria ? { categoria } : {};
    const contents = await Content.find(filter);
    res.json(contents);
  } catch (err) { next(err); }
};

export const createContent = async (req, res, next) => {
  try {
    const content = new Content(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (err) { next(err); }
};

export const updateContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!content) return res.status(404).json({ message: 'Conteúdo não encontrado' });
    res.json(content);
  } catch (err) { next(err); }
};

export const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: 'Conteúdo não encontrado' });
    res.json({ message: 'Conteúdo deletado com sucesso' });
  } catch (err) { next(err); }
};
