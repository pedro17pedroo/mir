import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import servicosController from '../controllers/servicosController.js';
const router = express.Router();

// GET público, POST protegido (admin)
router.get('/', servicosController.getServicos);
router.post('/', auth, admin, servicosController.saveServicos);

export default router;
