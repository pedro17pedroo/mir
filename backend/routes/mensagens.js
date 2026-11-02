import express from 'express';
import auth from '../middleware/auth.js';
import {
  getMensagens,
  createMensagem,
  updateMensagem,
  deleteMensagem
} from '../controllers/mensagemController.js';

const router = express.Router();

router.get('/', getMensagens);
router.post('/', auth, createMensagem);
router.put('/:id', auth, updateMensagem);
router.delete('/:id', auth, deleteMensagem);

export default router;
