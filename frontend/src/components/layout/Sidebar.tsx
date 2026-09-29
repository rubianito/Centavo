import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  FileBarChart,
  BellRing,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
    { id: 'transactions', label: 'Transacciones', icon: Receipt, active: false },
    { id: 'budgets', label: 'Presupuestos', icon: PiggyBank, active: false },
    { id: 'reports', label: 'Reportes', icon: FileBarChart, active: false },
    { id: 'alerts', label: 'Alertas', icon: BellRing, active: false, badge: '0' },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
        Menú Principal
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                item.active
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-5 w-5 ${
                    item.active ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 font-normal">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
        <h4 className="text-xs font-bold text-emerald-900">
          Control de Presupuesto
        </h4>
        <p className="mt-1 text-xs text-emerald-700 leading-relaxed">
          Monitorea tus gastos y mantén tus límites bajo control con Centavo.
        </p>
      </div>
    </aside>
  );
};
