import { body } from 'express-validator';

export const validateTransactionEvent = [
  body('amount')
    .notEmpty().withMessage('amount es requerido')
    .isNumeric().withMessage('amount debe ser un valor numérico')
    .custom((val) => {
      if (Number(val) === 0) {
        throw new Error('amount no puede ser 0');
      }
      return true;
    }),

  body('category')
    .notEmpty().withMessage('category es requerida')
    .isString().withMessage('category debe ser una cadena de texto')
    .trim(),

  body('transactionId')
    .optional()
    .isString().withMessage('transactionId debe ser una cadena de texto')
    .trim(),

  body('currentSpent')
    .optional()
    .isFloat({ min: 0 }).withMessage('currentSpent debe ser un número mayor o igual a 0'),

  body('budgetLimit')
    .optional()
    .isFloat({ gt: 0 }).withMessage('budgetLimit debe ser un número mayor a 0'),
];
