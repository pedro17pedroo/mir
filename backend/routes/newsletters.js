import express from 'express';
import auth from '../middleware/auth.js';
import { sendNewsletter, subscribeNewsletter, getNewsletters, deleteNewsletter } from '../controllers/newsletterController.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.post('/send', auth, sendNewsletter);
router.post('/', auth, sendNewsletter);
router.get('/', auth, getNewsletters);
router.delete('/:id', auth, deleteNewsletter);

export default router;
