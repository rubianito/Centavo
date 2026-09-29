import { Transaction, TransactionSummary } from '../types/transaction';
import { apiClient } from './apiClient';

export const transactionService = {
  /**
   * Obtiene la lista de transacciones del usuario.
   * Retorna una lista vacía para el estado inicial del scaffold.
   */
  async getTransactions(): Promise<Transaction[]> {
    const txApiUrl = import.meta.env.VITE_TRANSACTIONS_API_URL || '/api/transactions';

    try {
      const response = await apiClient<{ success?: boolean; data?: Transaction[] } | Transaction[]>(txApiUrl);
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch {
      // Retorna lista vacía en scaffold / desarrollo inicial
      return [];
    }
  },

  /**
   * Crea una nueva transacción en el microservicio.
   */
  async createTransaction(payload: {
    amount: number;
    category: string;
    date: string;
    description?: string;
  }): Promise<Transaction> {
    const txApiUrl = import.meta.env.VITE_TRANSACTIONS_API_URL || '/api/transactions';
    const response = await apiClient<{ success?: boolean; data?: Transaction } | Transaction>(txApiUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response && 'data' in response && response.data) {
      return response.data;
    }
    return response as Transaction;
  },

  /**
   * Calcula o recupera el resumen de balances y transacciones.
   */
  async getTransactionSummary(): Promise<TransactionSummary> {
    const summaryApiUrl = import.meta.env.VITE_TRANSACTIONS_API_URL
      ? `${import.meta.env.VITE_TRANSACTIONS_API_URL}/summary`
      : '/api/transactions/summary';

    try {
      return await apiClient<TransactionSummary>(summaryApiUrl);
    } catch {
      // Resumen inicial vacío para usuario nuevo
      return {
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        transactionCount: 0,
      };
    }
  },
};
