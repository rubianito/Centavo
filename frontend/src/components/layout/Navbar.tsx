import React from 'react';
import { User } from '../../types/auth';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold shadow-inner">
          🪙
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Centavo
          </span>
          <span className="hidden sm:inline-block ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            Finanzas
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-semibold text-sm shadow">
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-slate-800">
              {user?.name || 'Usuario'}
            </span>
            <span className="text-xs text-slate-500">
              {user?.email || 'usuario@centavo.app'}
            </span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
