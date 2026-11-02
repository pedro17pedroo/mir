import express from 'express';
import auth, { adminMiddleware } from '../middleware/auth.js';
import { exportarBackupJSON } from '../controllers/backupController.js';

const router = express.Router();

router.get('/', auth, adminMiddleware, exportarBackupJSON);

export default router;

