import express from 'express';
import auth from '../middleware/auth.js';
import {
  createVisitor,
  getVisitors,
  updateVisitor,
  converterEmMembro,
  deleteVisitor
} from '../controllers/visitorController.js';

const router = express.Router();

// Rota pública para o cartão de boas-vindas
router.post('/', createVisitor);

// Rotas administrativas de consolidação
router.get('/', auth, getVisitors);
router.put('/:id', auth, updateVisitor);
router.post('/:id/converter-membro', auth, converterEmMembro);
router.delete('/:id', auth, deleteVisitor);

export default router;

