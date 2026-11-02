import User from '../models/User.js';

const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.ativo === false) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado ou inativo',
        mensagem: 'Usuário não encontrado ou inativo' 
      });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Acesso negado. Permissão de administrador necessária.',
        mensagem: 'Acesso negado. Permissão de administrador necessária.' 
      });
    }
    
    next();
  } catch (err) {
    console.error('Erro no middleware de admin:', err);
    res.status(500).json({ message: 'Erro no servidor', mensagem: 'Erro no servidor' });
  }
};

export default admin;
