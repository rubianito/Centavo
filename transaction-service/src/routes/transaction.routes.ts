import { Router } from 'express';
import { create, list, summary } from '../controllers/transaction.controller';
import { validateCreateTransaction } from '../middlewares/validate.middleware';

const router = Router();

// GET /api/transactions/summary — Resumen de balances
router.get('/summary', summary);

// POST /api/transactions — Crear una transacción
router.post('/', validateCreateTransaction, create);

// GET /api/transactions — Listar transacciones (con ?category= opcional)
router.get('/', list);

export default router;
