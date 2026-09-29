import React from 'react';
import { TransactionSummary } from '../../types/transaction';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardsProps {
  summary: TransactionSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Balance Total */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Balance Total</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {formatCurrency(summary.totalBalance)}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Disponible en tus cuentas
          </p>
        </div>
      </div>

      {/* Total Ingresos */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Ingresos del Mes</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {formatCurrency(summary.totalIncome)}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Flujo positivo acumulado
          </p>
        </div>
      </div>

      {/* Total Gastos */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Gastos del Mes</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {formatCurrency(summary.totalExpense)}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Total de egresos registrados
          </p>
        </div>
      </div>
    </div>
  );
};
