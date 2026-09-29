import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionSummary } from '../types/transaction';
import { transactionService } from '../services/transactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [txList, txSummary] = await Promise.all([
        transactionService.getTransactions(),
        transactionService.getTransactionSummary(),
      ]);
      setTransactions(txList);
      setSummary(txSummary);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar transacciones';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  const addTransaction = useCallback(
    async (payload: {
      amount: number;
      category: string;
      date: string;
      description?: string;
    }) => {
      const newTx = await transactionService.createTransaction(payload);
      await fetchTransactionsData();
      return newTx;
    },
    [fetchTransactionsData]
  );

  return {
    transactions,
    summary,
    isLoading,
    error,
    refreshTransactions: fetchTransactionsData,
    addTransaction,
  };
}
