import express from 'express';
import auth from '../middleware/auth.js';
import {
  getEventos,
  getEventoBySlug,
  createEvento,
  updateEvento,
  deleteEvento,
  inscreverEvento,
  removerInscritoEvento
} from '../controllers/eventoController.js';

const router = express.Router();

router.get('/', getEventos);
router.get('/slug/:slug', getEventoBySlug);
router.post('/', auth, createEvento);
router.put('/:id', auth, updateEvento);
router.delete('/:id', auth, deleteEvento);
router.post('/:id/inscrever', inscreverEvento);
router.delete('/:id/inscritos/:inscritoId', auth, removerInscritoEvento);

export default router;
