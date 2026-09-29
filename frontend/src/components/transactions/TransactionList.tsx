import React from 'react';
import { Transaction } from '../../types/transaction';
import { EmptyTransactionsState } from './EmptyTransactionsState';
import { Filter, ArrowUpDown } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onAddTransaction?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  onAddTransaction,
}) => {
  return (
    <div className="space-y-4">
      {/* Encabezado de la sección de transacciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Movimientos y Transacciones
          </h2>
          <p className="text-xs text-slate-500">
            Historial detallado de tus ingresos y egresos recientes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrar</span>
          </button>
          <button
            type="button"
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Ordenar</span>
          </button>
        </div>
      </div>

      {/* Contenido: Estado de carga o Lista / Estado Vacío */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            <p className="text-sm text-slate-500">
              Cargando movimientos financieros...
            </p>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <EmptyTransactionsState onAddTransaction={onAddTransaction} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {tx.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 capitalize">
                    {tx.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.date ? tx.date.split('T')[0] : ''}</td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold text-right ${
                      tx.type === 'income' || tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'income' || tx.amount > 0 ? '+' : '-'}
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(Math.abs(tx.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
