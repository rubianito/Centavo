export type BudgetCategory =
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
  | 'otro';

export type BudgetPeriod = 'semanal' | 'mensual' | 'anual';

export interface Budget {
  id: string;
  category: BudgetCategory | string;
  limitAmount: number;  // Monto límite presupuestado
  period: BudgetPeriod; // 'semanal' | 'mensual' | 'anual'
  createdAt: string;    // ISO 8601 timestamp
  updatedAt?: string;   // ISO 8601 timestamp
}

export interface CreateBudgetDto {
  category: BudgetCategory | string;
  limitAmount: number;
  period: BudgetPeriod;
}
