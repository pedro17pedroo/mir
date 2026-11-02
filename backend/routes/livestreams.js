import express from 'express';
import auth from '../middleware/auth.js';
import {
  getLivestreams,
  createLivestream,
  updateLivestream,
  deleteLivestream
} from '../controllers/livestreamController.js';

const router = express.Router();

router.get('/', getLivestreams);
router.post('/', auth, createLivestream);
router.put('/:id', auth, updateLivestream);
router.delete('/:id', auth, deleteLivestream);

export default router;
