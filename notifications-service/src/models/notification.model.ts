export type AlertType = 'OVERSPENT' | 'WARNING_THRESHOLD';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'PUSH';

export interface TransactionEvent {
  id?: string;
  transactionId?: string;
  amount: number;       // Puede ser positivo o negativo (gasto)
  category: string;
  date?: string;        // ISO 8601 (YYYY-MM-DD)
  description?: string;
  currentSpent?: number; // Gasto acumulado previo opcional
  budgetLimit?: number;  // Monto límite de presupuesto opcional (evita llamada externa)
}

export interface NotificationAlert {
  id: string;
  transactionId?: string;
  category: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  transactionAmount: number;
  currentSpent: number;
  limitAmount: number;
  percentageUsed: number;
  channel: NotificationChannel;
  read: boolean;
  createdAt: string;    // ISO 8601 timestamp
}

export interface BudgetStatus {
  category: string;
  limitAmount: number;
  previousSpent: number;
  newSpent: number;
  percentageUsed: number;
  hasExceeded: boolean;
}

export interface ProcessTransactionResult {
  alertGenerated: boolean;
  message: string;
  alert?: NotificationAlert;
  budgetStatus?: BudgetStatus;
}
