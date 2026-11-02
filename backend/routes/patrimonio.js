import express from 'express';
import auth from '../middleware/auth.js';
import {
  getPatrimonio,
  createPatrimonio,
  updatePatrimonio,
  deletePatrimonio
} from '../controllers/patrimonioController.js';

const router = express.Router();

router.get('/', auth, getPatrimonio);
router.post('/', auth, createPatrimonio);
router.put('/:id', auth, updatePatrimonio);
router.delete('/:id', auth, deletePatrimonio);

export default router;

