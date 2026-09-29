import React from 'react';
import { ReceiptText, PlusCircle } from 'lucide-react';

interface EmptyTransactionsStateProps {
  onAddTransaction?: () => void;
}

export const EmptyTransactionsState: React.FC<EmptyTransactionsStateProps> = ({
  onAddTransaction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 px-6 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4 ring-8 ring-emerald-50/50">
        <ReceiptText className="h-8 w-8 stroke-[1.5]" />
      </div>

      <h3 className="text-lg font-bold text-slate-800">
        No tienes transacciones registradas
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
        Empieza a registrar tus ingresos y gastos para que Centavo calcule tus
        balances y controle tus presupuestos automáticamente.
      </p>

      <div className="mt-6">
        <button
          type="button"
          onClick={onAddTransaction}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Registrar primera transacción</span>
        </button>
      </div>
    </div>
  );
};
