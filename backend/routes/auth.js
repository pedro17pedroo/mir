import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  getUsers,
  updateUser,
  deleteUser
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

// Gestão de utilizadores (apenas Admin)
router.get('/users', auth, admin, getUsers);
router.put('/users/:id', auth, admin, updateUser);
router.delete('/users/:id', auth, admin, deleteUser);

export default router;
