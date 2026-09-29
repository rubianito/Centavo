import { body } from 'express-validator';
import { TransactionCategory } from '../models/transaction.model';

const VALID_CATEGORIES: TransactionCategory[] = [
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
  'ingreso',
  'otro',
];

export const validateCreateTransaction = [
  body('amount')
    .notEmpty().withMessage('amount es requerido')
    .isFloat({ min: -1_000_000, max: 1_000_000 }).withMessage('amount debe ser un número entre -1,000,000 y 1,000,000')
    .not().equals('0').withMessage('amount no puede ser 0'),

  body('category')
    .notEmpty().withMessage('category es requerida')
    .isIn(VALID_CATEGORIES).withMessage(`category debe ser uno de: ${VALID_CATEGORIES.join(', ')}`),

  body('date')
    .notEmpty().withMessage('date es requerida')
    .isISO8601().toDate().withMessage('date debe tener formato ISO 8601 (YYYY-MM-DD)'),

  body('description')
    .optional()
    .isString().withMessage('description debe ser texto')
    .isLength({ max: 255 }).withMessage('description no puede superar 255 caracteres')
    .trim(),
];
