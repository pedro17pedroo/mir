import express from 'express';
import {
  getPublicPrayers,
  createPrayerRequest,
  prayForRequest,
  getAllPrayers,
  updatePrayerRequest,
  deletePrayerRequest
} from '../controllers/prayerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/publicas', getPublicPrayers);
router.post('/', createPrayerRequest);
router.post('/:id/orar', prayForRequest);

// Rotas administrativas
router.get('/', auth, getAllPrayers);
router.put('/:id', auth, updatePrayerRequest);
router.delete('/:id', auth, deletePrayerRequest);

export default router;

