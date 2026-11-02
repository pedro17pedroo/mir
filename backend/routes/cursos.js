import express from 'express';
import auth from '../middleware/auth.js';
import {
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso,
  matricularAluno,
  removerAlunoCurso
} from '../controllers/cursoController.js';

const router = express.Router();

router.get('/', getCursos);
router.post('/', auth, createCurso);
router.put('/:id', auth, updateCurso);
router.delete('/:id', auth, deleteCurso);
router.post('/:id/matricular', matricularAluno);
router.delete('/:id/alunos/:alunoId', auth, removerAlunoCurso);

export default router;

