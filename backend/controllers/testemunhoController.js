import Testemunho from '../models/Testemunho.js';

export const getTestemunhos = async (req, res, next) => {
  try {
    const testemunhos = await Testemunho.find().sort({ ordem: 1, createdAt: -1 });
    res.json(testemunhos);
  } catch (err) { next(err); }
};

export const createTestemunho = async (req, res, next) => {
  try {
    const testemunho = new Testemunho(req.body);
    await testemunho.save();
    res.status(201).json(testemunho);
  } catch (err) { next(err); }
};

// Público: enviar testemunho para aprovação da moderação
export const createPublicTestemunho = async (req, res, next) => {
  try {
    const { nome, telefone, local, mensagem, texto } = req.body;
    const conteudo = String(mensagem || texto || '').trim();
    if (!nome || !conteudo) {
      return res.status(400).json({ message: 'Nome e relato do testemunho são obrigatórios.' });
    }

    const testemunho = new Testemunho({
      nome: String(nome).trim(),
      telefone: telefone ? String(telefone).trim() : '',
      local: local ? String(local).trim() : '',
      mensagem: conteudo,
      texto: conteudo,
      ativo: false,
      status: 'pendente'
    });

    await testemunho.save();
    res.status(201).json({
      message: 'Glória a Deus! O seu testemunho foi enviado e será publicado após revisão da equipa.',
      testemunho
    });
  } catch (err) {
    next(err);
  }
};

export const updateTestemunho = async (req, res, next) => {
  try {
    const testemunho = await Testemunho.findById(req.params.id);
    if (!testemunho) return res.status(404).json({ message: 'Testemunho não encontrado' });
    Object.assign(testemunho, req.body);
    await testemunho.save();
    res.json(testemunho);
  } catch (err) { next(err); }
};

export const deleteTestemunho = async (req, res, next) => {
  try {
    const testemunho = await Testemunho.findByIdAndDelete(req.params.id);
    if (!testemunho) return res.status(404).json({ message: 'Testemunho não encontrado' });
    res.json({ message: 'Testemunho deletado com sucesso' });
  } catch (err) { next(err); }
};
