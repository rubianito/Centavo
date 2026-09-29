import React, { useState } from 'react';
import { LoginCredentials } from '../../types/auth';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<boolean>;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    if (!email.trim()) {
      setClientError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!password || password.length < 6) {
      setClientError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    await onSubmit({ email: email.trim(), password });
  };

  const displayedError = clientError || errorMessage;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {displayedError && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p>{displayedError}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Correo electrónico
        </label>
        <div className="relative rounded-xl shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="usuario@centavo.app"
            className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 transition"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Contraseña
        </label>
        <div className="relative rounded-xl shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="••••••••"
            className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 transition"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Recordarme</span>
        </label>
        <button
          type="button"
          className="font-medium text-emerald-600 hover:text-emerald-700 transition"
        >
          ¿Olvidaste tu clave?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 font-semibold text-white shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-slate-300 transition"
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            <span>Iniciar Sesión</span>
          </>
        )}
      </button>
    </form>
  );
};
