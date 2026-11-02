import express from 'express';
import {
  getMinisterios,
  getMinisterioById,
  createMinisterio,
  updateMinisterio,
  deleteMinisterio,
  inscreverMinisterio,
  removerInteressado,
  adicionarRelatorio,
  removerRelatorio
} from '../controllers/ministerioController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMinisterios);
router.get('/:id', getMinisterioById);
router.post('/', auth, createMinisterio);
router.put('/:id', auth, updateMinisterio);
router.delete('/:id', auth, deleteMinisterio);
router.post('/:id/inscrever', inscreverMinisterio);
router.delete('/:id/interessados/:interessadoId', auth, removerInteressado);
router.post('/:id/relatorios', auth, adicionarRelatorio);
router.delete('/:id/relatorios/:relatorioId', auth, removerRelatorio);

export default router;

