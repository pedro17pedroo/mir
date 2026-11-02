import PrayerRequest from '../models/PrayerRequest.js';

// Listar pedidos públicos para o Mural de Oração
export const getPublicPrayers = async (req, res, next) => {
  try {
    const pedidos = await PrayerRequest.find({
      privacidade: 'publico',
      status: { $ne: 'arquivado' }
    })
      .select('nome tipo pedido anonimo status contadorOracoes respostaPastoral createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    const formatados = pedidos.map((p) => {
      const obj = p.toObject();
      if (obj.anonimo) {
        obj.nome = 'Irmão(ã) Anônimo(a)';
      }
      return obj;
    });

    res.json(formatados);
  } catch (err) {
    next(err);
  }
};

// Criar novo pedido de oração ou aconselhamento
export const createPrayerRequest = async (req, res, next) => {
  try {
    const { nome, email, telefone, tipo, pedido, privacidade, anonimo } = req.body;
    if (!pedido || ! String(pedido).trim()) {
      return res.status(400).json({ message: 'Por favor, escreva o seu pedido de oração.' });
    }

    const novo = new PrayerRequest({
      nome: nome ? String(nome).trim() : 'Anônimo',
      email: email ? String(email).trim() : '',
      telefone: telefone ? String(telefone).trim() : '',
      tipo: ['oracao', 'aconselhamento', 'gratidao'].includes(tipo) ? tipo : 'oracao',
      pedido: String(pedido).trim(),
      privacidade: privacidade === 'pastoral' ? 'pastoral' : 'publico',
      anonimo: Boolean(anonimo)
    });

    await novo.save();
    res.status(201).json({
      message:
        novo.privacidade === 'pastoral'
          ? 'O seu pedido foi enviado de forma confidencial para a equipa pastoral.'
          : 'O seu pedido foi publicado no Mural de Oração da igreja!',
      pedido: novo
    });
  } catch (err) {
    next(err);
  }
};

// Incrementar contador "Eu orei por você"
export const prayForRequest = async (req, res, next) => {
  try {
    const atualizado = await PrayerRequest.findByIdAndUpdate(
      req.params.id,
      { $inc: { contadorOracoes: 1 } },
      { new: true }
    );
    if (!atualizado) {
      return res.status(404).json({ message: 'Pedido de oração não encontrado' });
    }
    res.json({ contadorOracoes: atualizado.contadorOracoes });
  } catch (err) {
    next(err);
  }
};

// Admin: listar todos os pedidos (incluindo confidenciais)
export const getAllPrayers = async (req, res, next) => {
  try {
    const { status, privacidade, tipo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (privacidade) filter.privacidade = privacidade;
    if (tipo) filter.tipo = tipo;

    const pedidos = await PrayerRequest.find(filter).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
};

// Admin: atualizar status ou resposta pastoral
export const updatePrayerRequest = async (req, res, next) => {
  try {
    const pedido = await PrayerRequest.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const { status, respostaPastoral, privacidade } = req.body;
    if (status) pedido.status = status;
    if (privacidade) pedido.privacidade = privacidade;
    if (respostaPastoral !== undefined) {
      pedido.respostaPastoral = respostaPastoral;
      if (respostaPastoral && !pedido.respondidoEm) {
        pedido.respondidoEm = new Date();
      }
    }

    await pedido.save();
    res.json(pedido);
  } catch (err) {
    next(err);
  }
};

// Admin: remover pedido
export const deletePrayerRequest = async (req, res, next) => {
  try {
    const pedido = await PrayerRequest.findByIdAndDelete(req.params.id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    res.json({ message: 'Pedido removido com sucesso' });
  } catch (err) {
    next(err);
  }
};

