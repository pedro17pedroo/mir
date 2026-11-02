import Member from '../models/Member.js';

export const getMembers = async (req, res, next) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) { next(err); }
};

export const createMember = async (req, res, next) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) { next(err); }
};

export const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Membro não encontrado' });
    Object.assign(member, req.body);
    await member.save();
    res.json(member);
  } catch (err) { next(err); }
};

export const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Membro não encontrado' });
    res.json({ message: 'Membro deletado com sucesso' });
  } catch (err) { next(err); }
};
