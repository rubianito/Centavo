import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, login, error } = useAuth();
 
  // Pantalla de carga mientras se restaura la sesión inicial
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <span className="text-sm font-medium text-slate-500">Cargando Centavo...</span>
        </div>
      </div>
    );
  }

  // Si no está autenticado, muestra la pantalla de Login
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} isLoading={isLoading} errorMessage={error} />;
  }

  // Pantalla principal del Dashboard autenticado
  return <DashboardPage user={user} onLogout={logout} />;
};

export default App;
