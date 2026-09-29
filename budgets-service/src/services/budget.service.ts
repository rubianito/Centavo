import { v4 as uuidv4 } from 'uuid';
import { Budget, BudgetPeriod, CreateBudgetDto } from '../models/budget.model';

// Almacenamiento en memoria — reemplazar con repositorio PostgreSQL en la siguiente iteración
const budgets: Budget[] = [];

/**
 * Crea un nuevo presupuesto y lo persiste en el store en memoria.
 */
export function createBudget(dto: CreateBudgetDto): Budget {
  const now = new Date().toISOString();
  const budget: Budget = {
    id: uuidv4(),
    category: dto.category,
    limitAmount: dto.limitAmount,
    period: dto.period,
    createdAt: now,
    updatedAt: now,
  };

  budgets.push(budget);
  return budget;
}

/**
 * Retorna todos los presupuestos, con filtrado opcional por categoría y/o periodo.
 */
export function listBudgets(filters?: { category?: string; period?: BudgetPeriod }): Budget[] {
  let result = [...budgets];

  if (filters?.category) {
    const filterCat = filters.category.toLowerCase();
    result = result.filter((b) => b.category.toLowerCase() === filterCat);
  }

  if (filters?.period) {
    const filterPeriod = filters.period.toLowerCase();
    result = result.filter((b) => b.period.toLowerCase() === filterPeriod);
  }

  // Más recientes primero
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Busca un presupuesto por su ID.
 */
export function getBudgetById(id: string): Budget | undefined {
  return budgets.find((b) => b.id === id);
}

/**
 * Limpia el listado de presupuestos (útil para pruebas y desarrollo).
 */
export function clearBudgets(): void {
  budgets.length = 0;
}
