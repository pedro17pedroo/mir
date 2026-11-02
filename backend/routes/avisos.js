import express from 'express';
import auth from '../middleware/auth.js';
import {
  getAvisos,
  createAviso,
  updateAviso,
  deleteAviso
} from '../controllers/avisoController.js';

const router = express.Router();

router.get('/', getAvisos);
router.post('/', auth, createAviso);
router.put('/:id', auth, updateAviso);
router.delete('/:id', auth, deleteAviso);

export default router;

