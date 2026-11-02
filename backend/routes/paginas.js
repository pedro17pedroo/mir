import express from 'express';
import { check } from 'express-validator';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import {
  getPaginas,
  getPaginaPorId,
  getPaginaPorSlug,
  criarPagina,
  atualizarPagina,
  excluirPagina,
  atualizarOrdemMenu
} from '../controllers/pageController.js';

const router = express.Router();

// Validação
const validarPagina = [
  check('titulo', 'O título é obrigatório').optional().not().isEmpty().trim(),
  check('slug', 'O slug é obrigatório').optional().not().isEmpty().trim(),
  check('conteudo', 'O conteúdo é obrigatório').optional().not().isEmpty(),
  check('metaDescricao', 'A meta descrição não pode ter mais que 160 caracteres')
    .optional()
    .isLength({ max: 160 }),
  check('ordemMenu', 'A ordem no menu deve ser um número')
    .optional()
    .isInt({ min: 0 })
];

// Rotas públicas
router.get('/', getPaginas);
router.get('/slug/:slug(*)', getPaginaPorSlug);
router.get('/:id', getPaginaPorId);

// Rotas protegidas (requer autenticação)
router.post('/', [auth, ...validarPagina], criarPagina);
router.put('/:id', [auth, ...validarPagina], atualizarPagina);
router.delete('/:id', auth, excluirPagina);

// Rota para atualizar a ordem do menu (apenas admin)
router.patch('/ordem', [auth, admin], atualizarOrdemMenu);

export default router;
