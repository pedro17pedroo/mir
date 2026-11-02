import express from 'express';
import auth from '../middleware/auth.js';
import {
  getAudios,
  getAudioBySlug,
  createAudio,
  updateAudio,
  deleteAudio
} from '../controllers/audioController.js';

const router = express.Router();

router.get('/', getAudios);
router.get('/slug/:slug', getAudioBySlug);
router.post('/', auth, createAudio);
router.put('/:id', auth, updateAudio);
router.delete('/:id', auth, deleteAudio);

export default router;
