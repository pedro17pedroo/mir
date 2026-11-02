import Patrimonio from '../models/Patrimonio.js';

export const getPatrimonio = async (req, res, next) => {
  try {
    const itens = await Patrimonio.find().sort({ categoria: 1, nome: 1 });
    res.json(itens);
  } catch (err) {
    next(err);
  }
};

export const createPatrimonio = async (req, res, next) => {
  try {
    const { nome } = req.body;
    if (!nome || !String(nome).trim()) {
      return res.status(400).json({ message: 'O nome do bem/equipamento é obrigatório' });
    }
    const item = new Patrimonio({
      ...req.body,
      nome: String(nome).trim(),
      quantidade: Number(req.body.quantidade) || 1,
      valorUnitario: Number(req.body.valorUnitario) || 0
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updatePatrimonio = async (req, res, next) => {
  try {
    const item = await Patrimonio.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        quantidade:
          req.body.quantidade !== undefined ? Number(req.body.quantidade) : undefined,
        valorUnitario:
          req.body.valorUnitario !== undefined ? Number(req.body.valorUnitario) : undefined
      },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Item de património não encontrado' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deletePatrimonio = async (req, res, next) => {
  try {
    const item = await Patrimonio.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item de património não encontrado' });
    res.json({ message: 'Item removido do inventário com sucesso' });
  } catch (err) {
    next(err);
  }
};

