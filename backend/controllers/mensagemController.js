import Mensagem from '../models/Mensagem.js';

export const getMensagens = async (req, res, next) => {
  try {
    const { categoria } = req.query;
    const filter = categoria ? { categoria } : {};
    const mensagens = await Mensagem.find(filter).sort({ data: -1 });
    res.json(mensagens);
  } catch (err) { next(err); }
};

export const createMensagem = async (req, res, next) => {
  try {
    const mensagem = new Mensagem(req.body);
    await mensagem.save();
    res.status(201).json(mensagem);
  } catch (err) { next(err); }
};

export const updateMensagem = async (req, res, next) => {
  try {
    const mensagem = await Mensagem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mensagem) return res.status(404).json({ message: 'Mensagem não encontrada' });
    res.json(mensagem);
  } catch (err) { next(err); }
};

export const deleteMensagem = async (req, res, next) => {
  try {
    const mensagem = await Mensagem.findByIdAndDelete(req.params.id);
    if (!mensagem) return res.status(404).json({ message: 'Mensagem não encontrada' });
    res.json({ message: 'Mensagem deletada com sucesso' });
  } catch (err) { next(err); }
};
