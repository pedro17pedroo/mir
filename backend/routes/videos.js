import express from 'express';
import auth from '../middleware/auth.js';
import {
  getVideos,
  getVideoBySlug,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/videoController.js';

const router = express.Router();

router.get('/', getVideos);
router.get('/slug/:slug', getVideoBySlug);
router.post('/', auth, createVideo);
router.put('/:id', auth, updateVideo);
router.delete('/:id', auth, deleteVideo);

export default router;
