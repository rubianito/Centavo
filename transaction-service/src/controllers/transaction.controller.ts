import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TransactionCategory } from '../models/transaction.model';
import { createTransaction, listTransactions, getTransactionSummary } from '../services/transaction.service';

/**
 * POST /api/transactions
 * Crea una nueva transacción.
 */
export function create(req: Request, res: Response): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { amount, category, date, description } = req.body;
  const transaction = createTransaction({ amount, category, date, description });

  res.status(201).json({ success: true, data: transaction });
}

/**
 * GET /api/transactions
 * Lista transacciones. Acepta ?category= como query param opcional.
 */
export function list(req: Request, res: Response): void {
  const { category } = req.query;

  const transactions = listTransactions(
    category ? { category: category as TransactionCategory } : undefined
  );

  res.status(200).json({ success: true, data: transactions });
}

/**
 * GET /api/transactions/summary
 * Resumen de balances y transacciones.
 */
export function summary(_req: Request, res: Response): void {
  const summaryData = getTransactionSummary();
  res.status(200).json(summaryData);
}

