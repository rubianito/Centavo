import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { LoginCredentials } from '../types/auth';

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  isLoading = false,
  errorMessage = null,
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50/50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl shadow-slate-200/50">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl shadow-inner">
            🪙
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Centavo
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Control riguroso de tus finanzas personales, presupuestos y gastos
          </p>
        </div>

        <LoginForm
          onSubmit={onLogin}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />

        <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          ¿Aún no tienes cuenta?{' '}
          <button
            type="button"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
