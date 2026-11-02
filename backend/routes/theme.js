import express from 'express';
import auth from '../middleware/auth.js';
import { getTheme, updateTheme } from '../controllers/themeController.js';

const router = express.Router();

router.get('/', getTheme);
router.put('/', auth, updateTheme);

export default router;
