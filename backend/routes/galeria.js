import express from 'express';
import auth from '../middleware/auth.js';
import {
  getAlbunsPublicos,
  getAlbunsAdmin,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum
} from '../controllers/albumController.js';

const router = express.Router();

// Rotas públicas
router.get('/', getAlbunsPublicos);

// Rotas administrativas
router.get('/admin', auth, getAlbunsAdmin);
router.get('/:id', auth, getAlbumById);
router.post('/', auth, createAlbum);
router.put('/:id', auth, updateAlbum);
router.delete('/:id', auth, deleteAlbum);

export default router;

