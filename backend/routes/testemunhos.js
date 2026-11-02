import express from 'express';
import auth from '../middleware/auth.js';
import {
  getTestemunhos,
  createTestemunho,
  createPublicTestemunho,
  updateTestemunho,
  deleteTestemunho
} from '../controllers/testemunhoController.js';

const router = express.Router();

router.get('/', getTestemunhos);
router.post('/publico', createPublicTestemunho);
router.post('/', auth, createTestemunho);
router.put('/:id', auth, updateTestemunho);
router.delete('/:id', auth, deleteTestemunho);

export default router;
