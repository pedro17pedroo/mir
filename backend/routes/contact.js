import express from 'express';
import auth from '../middleware/auth.js';
import {
  getContactInfo,
  updateContactInfo,
  getContactMessages,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
  respondContactMessage,
  markAsRead
} from '../controllers/contactController.js';

const router = express.Router();

// Rotas públicas
router.get('/info', getContactInfo);
router.post('/messages', createContactMessage);

// Rotas protegidas (admin)
router.put('/info', auth, updateContactInfo);
router.get('/messages', auth, getContactMessages);
router.patch('/messages/:id/read', auth, markAsRead);
router.put('/messages/:id', auth, updateContactMessage);
router.delete('/messages/:id', auth, deleteContactMessage);
router.post('/messages/:id/respond', auth, respondContactMessage);

export default router;
