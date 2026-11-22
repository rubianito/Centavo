import { v4 as uuidv4 } from 'uuid';
import {
  BudgetStatus,
  NotificationAlert,
  ProcessTransactionResult,
  TransactionEvent,
} from '../models/notification.model';

// Almacenamiento en memoria — replicando la convención de budgets-service y transaction-service
const notifications: NotificationAlert[] = [];
const categorySpending: Map<string, number> = new Map();

const BUDGETS_SERVICE_URL = process.env.BUDGETS_SERVICE_URL || 'http://localhost:4002';

/**
 * Consulta el presupuesto correspondiente a una categoría en budgets-service.
 */
export async function fetchBudgetForCategory(category: string): Promise<{ limitAmount: number; period?: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const url = `${BUDGETS_SERVICE_URL}/api/budgets?category=${encodeURIComponent(category)}`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { success?: boolean; data?: Array<{ limitAmount: number; period?: string }> };
    if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
      // Tomamos el presupuesto más reciente para esa categoría
      const budget = data.data[0];
      return {
        limitAmount: budget.limitAmount,
        period: budget.period,
      };
    }

    return null;
  } catch (_error) {
    // Si el microservicio budgets-service no está encendido o no responde
    return null;
  }
}

/**
 * Procesa un evento de nueva transacción y determina contra el presupuesto
 * si se debe generar una alerta de sobregasto o advertencia de umbral.
 */
export async function processTransactionEvent(event: TransactionEvent): Promise<ProcessTransactionResult> {
  const normalizedCategory = event.category.trim().toLowerCase();

  // Si la transacción es de tipo 'ingreso', no se calcula sobregasto
  if (normalizedCategory === 'ingreso') {
    return {
      alertGenerated: false,
      message: 'Las transacciones de ingreso no generan alertas de presupuesto.',
    };
  }

  const transactionAmount = Math.abs(event.amount);
  const transactionId = event.transactionId || event.id;

  // 1. Obtener el límite de presupuesto (vía parámetro explícito o consulta a budgets-service)
  let limitAmount = event.budgetLimit;

  if (limitAmount === undefined || limitAmount === null) {
    const remoteBudget = await fetchBudgetForCategory(normalizedCategory);
    if (remoteBudget) {
      limitAmount = remoteBudget.limitAmount;
    }
  }

  // Si no se encuentra un presupuesto registrado
  if (limitAmount === undefined || limitAmount === null || limitAmount <= 0) {
    return {
      alertGenerated: false,
      message: `No se encontró un presupuesto configurado para la categoría "${event.category}".`,
    };
  }

  // 2. Calcular gasto acumulado
  const previousSpent = event.currentSpent !== undefined
    ? event.currentSpent
    : (categorySpending.get(normalizedCategory) || 0);

  const newSpent = previousSpent + transactionAmount;
  categorySpending.set(normalizedCategory, newSpent);

  const percentageUsed = Math.round((newSpent / limitAmount) * 100 * 100) / 100;
  const hasExceeded = newSpent > limitAmount;
  const hasReachedWarning = newSpent >= limitAmount * 0.8;

  const budgetStatus: BudgetStatus = {
    category: event.category,
    limitAmount,
    previousSpent,
    newSpent,
    percentageUsed,
    hasExceeded,
  };

  // 3. Determinar si corresponde generar alerta
  if (hasExceeded) {
    const excess = (newSpent - limitAmount).toFixed(2);
    const alert: NotificationAlert = {
      id: uuidv4(),
      transactionId,
      category: event.category,
      type: 'OVERSPENT',
      severity: 'CRITICAL',
      message: `¡Alerta de sobregasto! Has superado el presupuesto de "${event.category}" en $${excess}. Gasto acumulado: $${newSpent.toFixed(2)} de un límite de $${limitAmount.toFixed(2)} (${percentageUsed}%).`,
      transactionAmount,
      currentSpent: newSpent,
      limitAmount,
      percentageUsed,
      channel: 'IN_APP',
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifications.unshift(alert);

    return {
      alertGenerated: true,
      message: 'Alerta de sobregasto generada exitosamente.',
      alert,
      budgetStatus,
    };
  }

  if (hasReachedWarning) {
    const alert: NotificationAlert = {
      id: uuidv4(),
      transactionId,
      category: event.category,
      type: 'WARNING_THRESHOLD',
      severity: 'WARNING',
      message: `¡Advertencia de presupuesto! Has alcanzado el ${percentageUsed}% del presupuesto asignado a "${event.category}". Gasto acumulado: $${newSpent.toFixed(2)} de $${limitAmount.toFixed(2)}.`,
      transactionAmount,
      currentSpent: newSpent,
      limitAmount,
      percentageUsed,
      channel: 'IN_APP',
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifications.unshift(alert);

    return {
      alertGenerated: true,
      message: 'Advertencia de proximidad al límite presupuestario generada.',
      alert,
      budgetStatus,
    };
  }

  return {
    alertGenerated: false,
    message: 'Transacción procesada dentro de los límites del presupuesto.',
    budgetStatus,
  };
}

/**
 * Retorna las notificaciones registradas, con filtros opcionales.
 */
export function listNotifications(filters?: { read?: boolean; category?: string }): NotificationAlert[] {
  let result = [...notifications];

  if (filters?.read !== undefined) {
    result = result.filter((n) => n.read === filters.read);
  }

  if (filters?.category) {
    const cat = filters.category.toLowerCase();
    result = result.filter((n) => n.category.toLowerCase() === cat);
  }

  return result;
}

/**
 * Busca una notificación por ID.
 */
export function getNotificationById(id: string): NotificationAlert | undefined {
  return notifications.find((n) => n.id === id);
}

/**
 * Marca una notificación como leída.
 */
export function markNotificationAsRead(id: string): NotificationAlert | null {
  const notif = notifications.find((n) => n.id === id);
  if (!notif) return null;

  notif.read = true;
  return notif;
}

/**
 * Limpia el estado en memoria (para testing).
 */
export function clearNotifications(): void {
  notifications.length = 0;
  categorySpending.clear();
}
