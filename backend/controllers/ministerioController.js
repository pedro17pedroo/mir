import Ministerio from '../models/Ministerio.js';

export const getMinisterios = async (req, res, next) => {
  try {
    const { tipo, ativo } = req.query;
    const filter = {};
    if (tipo) filter.tipo = tipo;
    if (ativo !== undefined) filter.ativo = ativo === 'true';

    const ministerios = await Ministerio.find(filter).sort({ ordem: 1, nome: 1 });
    res.json(ministerios);
  } catch (err) {
    next(err);
  }
};

export const getMinisterioById = async (req, res, next) => {
  try {
    const ministerio = await Ministerio.findById(req.params.id);
    if (!ministerio) {
      return res.status(404).json({ message: 'Ministério ou célula não encontrado' });
    }
    res.json(ministerio);
  } catch (err) {
    next(err);
  }
};

export const createMinisterio = async (req, res, next) => {
  try {
    const ministerio = new Ministerio(req.body);
    await ministerio.save();
    res.status(201).json(ministerio);
  } catch (err) {
    next(err);
  }
};

export const updateMinisterio = async (req, res, next) => {
  try {
    const ministerio = await Ministerio.findById(req.params.id);
    if (!ministerio) {
      return res.status(404).json({ message: 'Ministério ou célula não encontrado' });
    }
    Object.assign(ministerio, req.body);
    await ministerio.save();
    res.json(ministerio);
  } catch (err) {
    next(err);
  }
};

export const deleteMinisterio = async (req, res, next) => {
  try {
    const ministerio = await Ministerio.findByIdAndDelete(req.params.id);
    if (!ministerio) {
      return res.status(404).json({ message: 'Ministério ou célula não encontrado' });
    }
    res.json({ message: 'Ministério ou célula removido com sucesso' });
  } catch (err) {
    next(err);
  }
};

export const inscreverMinisterio = async (req, res, next) => {
  try {
    const { nome, telefone, email, mensagem } = req.body;
    if (!nome || !telefone) {
      return res.status(400).json({ message: 'Nome e telefone são obrigatórios' });
    }

    const ministerio = await Ministerio.findById(req.params.id);
    if (!ministerio) {
      return res.status(404).json({ message: 'Ministério ou célula não encontrado' });
    }

    ministerio.interessados.push({
      nome: String(nome).trim(),
      telefone: String(telefone).trim(),
      email: email ? String(email).trim() : '',
      mensagem: mensagem ? String(mensagem).trim() : '',
      status: 'pendente',
      data: new Date()
    });

    await ministerio.save();
    res.status(201).json({
      message: 'Inscrição enviada com sucesso! O líder entrará em contato em breve.',
      ministerio
    });
  } catch (err) {
    next(err);
  }
};

export const removerInteressado = async (req, res, next) => {
  try {
    const { id, interessadoId } = req.params;
    const ministerio = await Ministerio.findById(id);
    if (!ministerio) {
      return res.status(404).json({ message: 'Ministério não encontrado' });
    }

    ministerio.interessados = ministerio.interessados.filter(
      (i) => i._id.toString() !== interessadoId
    );
    await ministerio.save();
    res.json(ministerio);
  } catch (err) {
    next(err);
  }
};

export const adicionarRelatorio = async (req, res, next) => {
  try {
    const ministerio = await Ministerio.findById(req.params.id);
    if (!ministerio) {
      return res.status(404).json({ message: 'Ministério ou célula não encontrado' });
    }
    const { data, presentes, visitantes, decisoes, oferta, tema, observacoes } = req.body;
    ministerio.relatorios.unshift({
      data: data ? new Date(data) : new Date(),
      presentes: Number(presentes) || 0,
      visitantes: Number(visitantes) || 0,
      decisoes: Number(decisoes) || 0,
      oferta: Number(oferta) || 0,
      tema: tema ? String(tema).trim() : '',
      observacoes: observacoes ? String(observacoes).trim() : ''
    });
    await ministerio.save();
    res.status(201).json(ministerio);
  } catch (err) {
    next(err);
  }
};

export const removerRelatorio = async (req, res, next) => {
  try {
    const { id, relatorioId } = req.params;
    const ministerio = await Ministerio.findById(id);
    if (!ministerio) {
      return res.status(404).json({ message: 'Ministério ou célula não encontrado' });
    }
    ministerio.relatorios = ministerio.relatorios.filter(
      (r) => r._id.toString() !== relatorioId
    );
    await ministerio.save();
    res.json(ministerio);
  } catch (err) {
    next(err);
  }
};


