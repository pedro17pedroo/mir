import express from 'express';
import auth from '../middleware/auth.js';
import {
  getContents,
  createContent,
  updateContent,
  deleteContent
} from '../controllers/contentController.js';

const router = express.Router();

router.get('/', getContents);
router.post('/', auth, createContent);
router.put('/:id', auth, updateContent);
router.delete('/:id', auth, deleteContent);

export default router;
