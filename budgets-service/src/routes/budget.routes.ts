import { Router } from 'express';
import { create, getById, list } from '../controllers/budget.controller';
import { validateCreateBudget } from '../middlewares/validate.middleware';

const router = Router();

// POST /api/budgets — Crear un presupuesto (categoría, monto límite, periodo)
router.post('/', validateCreateBudget, create);

// GET /api/budgets — Listar presupuestos (con ?category= y ?period= opcionales)
router.get('/', list);

// GET /api/budgets/:id — Consultar un presupuesto por ID
router.get('/:id', getById);

export default router;
