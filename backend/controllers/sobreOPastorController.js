import SobreOPastor from '../models/SobreOPastor.js';

const sobreOPastorController = {};

sobreOPastorController.getSobreOPastor = async (req, res) => {
  try {
    let doc = await SobreOPastor.findOne();
    if (!doc) doc = await SobreOPastor.create({});
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do Sobre o Pastor' });
  }
};

sobreOPastorController.saveSobreOPastor = async (req, res) => {
  try {
    let doc = await SobreOPastor.findOne();
    if (!doc) doc = new SobreOPastor();
    Object.assign(doc, req.body);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar dados do Sobre o Pastor' });
  }
};

export default sobreOPastorController;
