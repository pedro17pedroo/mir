import express from 'express';
import auth from '../middleware/auth.js';
import {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu
} from '../controllers/menuController.js';

const router = express.Router();

router.get('/', getMenus);
router.post('/', auth, createMenu);
router.put('/:id', auth, updateMenu);
router.delete('/:id', auth, deleteMenu);

export default router;
