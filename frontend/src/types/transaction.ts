export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'housing'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'other';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  createdAt: string;
}

export interface TransactionSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
}
