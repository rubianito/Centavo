import { body } from 'express-validator';
import { BudgetCategory, BudgetPeriod } from '../models/budget.model';

export const VALID_CATEGORIES: BudgetCategory[] = [
  'Comida',
  'comida',
  'alimentación',
  'vivienda',
  'transporte',
  'salud',
  'educación',
  'ocio',
  'servicios',
  'ropa',
  'ahorro',
  'otro',
];

export const VALID_PERIODS: BudgetPeriod[] = ['semanal', 'mensual', 'anual'];

export const validateCreateBudget = [
  body('category')
    .notEmpty().withMessage('category es requerida')
    .isString().withMessage('category debe ser una cadena de texto')
    .trim()
    .isIn(VALID_CATEGORIES).withMessage(`category debe ser uno de: ${VALID_CATEGORIES.join(', ')}`),

  body('limitAmount')
    .custom((value, { req }) => {
      const val = value !== undefined && value !== null ? value : (req.body.limit ?? req.body.amount ?? req.body.montoLimite);
      if (val === undefined || val === null || val === '') {
        throw new Error('limitAmount (monto límite) es requerido');
      }
      const num = Number(val);
      if (isNaN(num) || num <= 0) {
        throw new Error('limitAmount debe ser un número positivo mayor a 0');
      }
      // Aseguramos que req.body.limitAmount tenga el valor numérico
      req.body.limitAmount = num;
      return true;
    }),

  body('period')
    .notEmpty().withMessage('period es requerido')
    .isString().withMessage('period debe ser una cadena de texto')
    .trim()
    .customSanitizer((v: string) => v.toLowerCase())
    .isIn(VALID_PERIODS).withMessage(`period debe ser uno de: ${VALID_PERIODS.join(', ')}`),
];
