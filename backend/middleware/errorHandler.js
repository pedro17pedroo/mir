const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro:', err);
  
  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Erro de validação',
      errors
    });
  }
  
  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'ID inválido fornecido'
    });
  }
  
  // Erro de duplicação (chave única)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `Já existe um registro com este ${field}`
    });
  }
  
  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado'
    });
  }
  
  // Erro de CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      message: 'Origem não permitida pelo CORS'
    });
  }
  
  // Erro genérico
  res.status(err.statusCode || 500).json({
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
