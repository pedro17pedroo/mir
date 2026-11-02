import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const ROLES_VALIDOS = ['admin', 'pastor', 'secretaria', 'midia', 'tesouraria'];

// Validação de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de senha forte
const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const register = async (req, res, next) => {
  try {
    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount > 0) {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Apenas administradores autenticados podem criar novos usuários' });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const requester = await User.findById(decoded.id);
        if (!requester || requester.role !== 'admin' || requester.ativo === false) {
          return res.status(403).json({ message: 'Acesso negado. Permissão de administrador necessária.' });
        }
      } catch {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }
    }

    const { nome, email, password, senha, role, cargo, telefone } = req.body;
    const rawPassword = password || senha;

    if (!email || !rawPassword) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (!isStrongPassword(rawPassword)) {
      return res.status(400).json({ 
        message: 'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números' 
      });
    }

    const userExist = await User.findOne({ email: email.toLowerCase() });
    if (userExist) return res.status(400).json({ message: 'Usuário já existe' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);
    const user = new User({
      nome,
      email: email.toLowerCase(),
      password: hash,
      role: ROLES_VALIDOS.includes(role) ? role : 'admin',
      cargo: cargo || '',
      telefone: telefone || '',
      ativo: true
    });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ message: 'Usuário criado com sucesso', user: userResponse });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, senha } = req.body;
    const rawPassword = password || senha;

    if (!email || !rawPassword) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.ativo === false) {
      return res.status(400).json({ message: 'Credenciais inválidas ou conta desativada' });
    }

    const isMatch = await bcrypt.compare(rawPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.json({ 
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        cargo: user.cargo
      }
    });
  } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user || user.ativo === false) {
      return res.status(404).json({ message: 'Usuário não encontrado ou inativo' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (err) {
    next(err);
  }
};

// Admin: listar todos os utilizadores
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Admin: atualizar utilizador (perfil, role, ativo, senha opcional)
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    const { nome, email, role, cargo, telefone, ativo, password } = req.body;
    if (nome !== undefined) user.nome = nome;
    if (email !== undefined && isValidEmail(email)) user.email = email.toLowerCase();
    if (role !== undefined && ROLES_VALIDOS.includes(role)) user.role = role;
    if (cargo !== undefined) user.cargo = cargo;
    if (telefone !== undefined) user.telefone = telefone;
    if (ativo !== undefined) {
      if (user._id.toString() === req.user.id && ativo === false) {
        return res.status(400).json({ message: 'Você não pode desativar a sua própria conta' });
      }
      user.ativo = Boolean(ativo);
    }

    if (password && String(password).trim() !== '') {
      if (!isStrongPassword(password)) {
        return res.status(400).json({
          message: 'A nova senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números'
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    const updated = user.toObject();
    delete updated.password;
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Admin: remover utilizador
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Você não pode excluir a sua própria conta' });
    }
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }
    res.json({ message: 'Utilizador removido com sucesso' });
  } catch (err) {
    next(err);
  }
};
