import Servicos from '../models/Servicos.js';

const servicosController = {};

servicosController.getServicos = async (req, res) => {
  try {
    let doc = await Servicos.findOne();
    if (!doc) doc = await Servicos.create({ titulo: '', servicos: [] });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
};

servicosController.saveServicos = async (req, res) => {
  try {
    let doc = await Servicos.findOne();
    if (!doc) doc = new Servicos();
    doc.titulo = req.body.titulo;
    doc.servicos = req.body.servicos;
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar serviços' });
  }
};

export default servicosController;
