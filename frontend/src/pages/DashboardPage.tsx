import React, { useState } from 'react';
import { User } from '../types/auth';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { TransactionList } from '../components/transactions/TransactionList';
import { useTransactions } from '../hooks/useTransactions';
import { Plus, X } from 'lucide-react';

interface DashboardPageProps {
  user: User | null;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onLogout,
}) => {
  const { transactions, summary, isLoading, addTransaction } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('Comida');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setAmount('');
    setType('expense');
    setCategory('Comida');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setFormError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      const finalAmount = type === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount);
      await addTransaction({
        amount: finalAmount,
        category,
        date,
        description: description.trim() || undefined,
      });
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al registrar la transacción');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <div className="space-y-8">
        {/* Encabezado con bienvenida y acción rápida */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              ¡Hola, {user?.name || 'Usuario'}! 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Aquí está el resumen financiero de tu cuenta en Centavo.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Transacción</span>
          </button>
        </div>

        {/* Tarjetas de Resumen Financiero */}
        <SummaryCards summary={summary} />

        {/* Listado de Transacciones */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Movimientos Recientes
            </h2>
            <p className="text-xs text-slate-500">
              Listado y control de tus operaciones registradas
            </p>
          </div>

          <TransactionList
            transactions={transactions}
            isLoading={isLoading}
            onAddTransaction={handleOpenModal}
          />
        </div>
      </div>

      {/* Modal para Crear Transacción */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Registrar Transacción</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {formError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {formError}
                </div>
              )}

              {/* Selector de Tipo: Gasto / Ingreso */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`rounded-xl py-2 text-sm font-semibold transition ${
                    type === 'expense'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`rounded-xl py-2 text-sm font-semibold transition ${
                    type === 'income'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Ingreso
                </button>
              </div>

              {/* Campo Monto */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monto ($)
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                  required
                />
              </div>

              {/* Campo Categoría */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition bg-white"
                >
                  <option value="Comida">Comida</option>
                  <option value="vivienda">Vivienda</option>
                  <option value="transporte">Transporte</option>
                  <option value="salud">Salud</option>
                  <option value="educación">Educación</option>
                  <option value="ocio">Ocio</option>
                  <option value="servicios">Servicios</option>
                  <option value="ropa">Ropa</option>
                  <option value="ahorro">Ahorro</option>
                  <option value="ingreso">Ingreso</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Campo Fecha */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                  required
                />
              </div>

              {/* Campo Descripción */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Almuerzo de trabajo"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;

