import express from 'express';
import auth from '../middleware/auth.js';
import {
  getSections,
  createSection,
  updateSection,
  deleteSection
} from '../controllers/sectionController.js';

const router = express.Router();

router.get('/', getSections);
router.post('/', auth, createSection);
router.put('/:id', auth, updateSection);
router.delete('/:id', auth, deleteSection);

export default router;
