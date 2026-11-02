import express from 'express';
import auth from '../middleware/auth.js';
import {
  createDonation,
  getDonations,
  getDonationById,
  updateDonationStatus,
  deleteDonation
} from '../controllers/donationController.js';

const router = express.Router();

// Rotas públicas
router.post('/', createDonation);

// Rotas protegidas (admin / tesouraria)
router.get('/', auth, getDonations);
router.get('/:id', auth, getDonationById);
router.put('/:id/status', auth, updateDonationStatus);
router.delete('/:id', auth, deleteDonation);

export default router;
