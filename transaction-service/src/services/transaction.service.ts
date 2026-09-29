import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionDto, Transaction, TransactionCategory } from '../models/transaction.model';

// Almacenamiento en memoria — reemplazar con repositorio PostgreSQL en la siguiente iteración
const transactions: Transaction[] = [];

/**
 * Crea una nueva transacción y la persiste en el store en memoria.
 */
export function createTransaction(dto: CreateTransactionDto): Transaction {
  const transaction: Transaction = {
    id: uuidv4(),
    amount: dto.amount,
    category: dto.category,
    date: dto.date,
    description: dto.description,
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);
  return transaction;
}

/**
 * Retorna todas las transacciones, con filtrado opcional por categoría.
 */
export function listTransactions(filters?: { category?: TransactionCategory }): Transaction[] {
  let result = [...transactions];

  if (filters?.category) {
    result = result.filter((t) => t.category === filters.category);
  }

  // Más recientes primero
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Retorna el resumen consolidado de finanzas: balance, ingresos, gastos y contador.
 */
export function getTransactionSummary() {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.amount > 0) {
      totalIncome += t.amount;
    } else {
      totalExpense += Math.abs(t.amount);
    }
  }

  return {
    totalBalance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    transactionCount: transactions.length,
  };
}

