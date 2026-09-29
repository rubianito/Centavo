import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { BudgetPeriod } from '../models/budget.model';
import { createBudget, getBudgetById, listBudgets } from '../services/budget.service';

/**
 * POST /api/budgets
 * Crea un nuevo presupuesto (categoría, monto límite, periodo).
 */
export function create(req: Request, res: Response): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { category, limitAmount, period } = req.body;
  const budget = createBudget({
    category,
    limitAmount: Number(limitAmount),
    period: period as BudgetPeriod,
  });

  res.status(201).json({ success: true, data: budget });
}

/**
 * GET /api/budgets
 * Lista presupuestos con filtros opcionales por ?category= y ?period=
 */
export function list(req: Request, res: Response): void {
  const { category, period } = req.query;

  const budgets = listBudgets({
    category: category ? (category as string) : undefined,
    period: period ? (period as BudgetPeriod) : undefined,
  });

  res.status(200).json({ success: true, data: budgets });
}

/**
 * GET /api/budgets/:id
 * Consulta un presupuesto por su identificador único.
 */
export function getById(req: Request, res: Response): void {
  const { id } = req.params;
  const budget = getBudgetById(id);

  if (!budget) {
    res.status(404).json({ success: false, message: 'Presupuesto no encontrado' });
    return;
  }

  res.status(200).json({ success: true, data: budget });
}
