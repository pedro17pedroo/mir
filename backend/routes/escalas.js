import express from 'express';
import auth from '../middleware/auth.js';
import {
  getEscalas,
  createEscala,
  updateEscala,
  deleteEscala
} from '../controllers/escalaController.js';

const router = express.Router();

router.get('/', getEscalas);
router.post('/', auth, createEscala);
router.put('/:id', auth, updateEscala);
router.delete('/:id', auth, deleteEscala);

export default router;

