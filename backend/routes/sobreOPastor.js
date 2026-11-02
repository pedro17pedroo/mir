import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import sobreOPastorController from '../controllers/sobreOPastorController.js';
const router = express.Router();

// GET público, POST protegido (admin)
router.get('/', sobreOPastorController.getSobreOPastor);
router.post('/', auth, admin, sobreOPastorController.saveSobreOPastor);

export default router;
