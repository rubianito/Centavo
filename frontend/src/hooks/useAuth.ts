import { useState, useEffect, useCallback } from 'react';
import { AuthState, LoginCredentials, User } from '../types/auth';
import { authService } from '../services/authService';
import { getStoredToken } from '../services/apiClient';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Inicializar estado de autenticación al montar
  useEffect(() => {
    const token = getStoredToken();
    const user = authService.getCurrentUser();

    setState({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading: false,
      error: null,
    });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user as User | null,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    clearError,
  };
}
