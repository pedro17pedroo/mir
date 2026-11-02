import Visitor from '../models/Visitor.js';
import Member from '../models/Member.js';

// Público: registrar cartão de boas-vindas / decisão
export const createVisitor = async (req, res, next) => {
  try {
    const {
      nome,
      telefone,
      email,
      bairro,
      faixaEtaria,
      tipoVisita,
      comoConheceu,
      desejaVisitaPastoral,
      desejaCelula,
      desejaBatismo,
      observacoes
    } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ message: 'Nome e telefone são obrigatórios.' });
    }

    const visitor = new Visitor({
      nome: String(nome).trim(),
      telefone: String(telefone).trim(),
      email: email ? String(email).trim() : '',
      bairro: bairro ? String(bairro).trim() : '',
      faixaEtaria: faixaEtaria || 'adulto',
      tipoVisita: tipoVisita || 'primeira_vez',
      comoConheceu: comoConheceu ? String(comoConheceu).trim() : '',
      desejaVisitaPastoral: Boolean(desejaVisitaPastoral),
      desejaCelula: Boolean(desejaCelula),
      desejaBatismo: Boolean(desejaBatismo),
      observacoes: observacoes ? String(observacoes).trim() : ''
    });

    await visitor.save();
    res.status(201).json({
      message: 'Seja muito bem-vindo(a) à família Igreja MIR! A nossa equipa de acolhimento entrará em contato consigo.',
      visitor
    });
  } catch (err) {
    next(err);
  }
};

// Admin: listar visitantes e novos convertidos
export const getVisitors = async (req, res, next) => {
  try {
    const { statusConsolidacao, tipoVisita } = req.query;
    const filter = {};
    if (statusConsolidacao) filter.statusConsolidacao = statusConsolidacao;
    if (tipoVisita) filter.tipoVisita = tipoVisita;

    const visitors = await Visitor.find(filter).sort({ createdAt: -1 });
    res.json(visitors);
  } catch (err) {
    next(err);
  }
};

// Admin: atualizar acompanhamento / consolidação
export const updateVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Registo não encontrado' });
    }
    Object.assign(visitor, req.body);
    await visitor.save();
    res.json(visitor);
  } catch (err) {
    next(err);
  }
};

// Admin: converter visitante/novo convertido em Membro Oficial com 1 clique
export const converterEmMembro = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitante não encontrado' });
    }

    const memberData = {
      nome: visitor.nome,
      telefone: visitor.telefone,
      endereco: visitor.bairro || '',
      cargo: 'Membro',
      status: 'ativo',
      ativo: true,
      observacoes: `Integrado a partir do acolhimento (${visitor.tipoVisita}). ${visitor.observacoes || ''}`.trim()
    };

    if (visitor.email && visitor.email.includes('@')) {
      const existingEmail = await Member.findOne({ email: visitor.email });
      if (!existingEmail) {
        memberData.email = visitor.email;
      }
    }

    const novoMembro = new Member(memberData);
    await novoMembro.save();

    visitor.statusConsolidacao = 'integrado';
    await visitor.save();

    res.status(201).json({
      message: `${visitor.nome} foi integrado(a) com sucesso ao rol de membros da Igreja MIR!`,
      member: novoMembro,
      membro: novoMembro,
      visitor
    });
  } catch (err) {
    next(err);
  }
};

// Admin: excluir visitante
export const deleteVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Registo não encontrado' });
    }
    res.json({ message: 'Registo removido com sucesso' });
  } catch (err) {
    next(err);
  }
};

