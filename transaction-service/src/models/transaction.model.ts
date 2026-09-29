export type TransactionCategory =
  | 'Comida'
  | 'comida'
  | 'alimentación'
  | 'vivienda'
  | 'transporte'
  | 'salud'
  | 'educación'
  | 'ocio'
  | 'servicios'
  | 'ropa'
  | 'ahorro'
  | 'ingreso'
  | 'otro';

export interface Transaction {
  id: string;
  amount: number;       // Positivo = ingreso, negativo = gasto
  category: TransactionCategory;
  date: string;         // ISO 8601 (YYYY-MM-DD)
  description?: string;
  createdAt: string;    // ISO 8601 timestamp
}

export interface CreateTransactionDto {
  amount: number;
  category: TransactionCategory;
  date: string;
  description?: string;
}
