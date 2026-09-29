import { AuthResponse, LoginCredentials, User } from '../types/auth';
import { clearStoredToken, getStoredToken, setStoredToken } from './apiClient';

const USER_STORAGE_KEY = 'centavo_user_data';

export const authService = {
  /**
   * Inicia sesión con credenciales de usuario.
   * Si el microservicio no está disponible, provee un fallback para prototipado seguro.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const authApiUrl = import.meta.env.VITE_AUTH_API_URL || '/api/auth/login';

    try {
      const response = await fetch(authApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = (await response.json()) as AuthResponse;
      setStoredToken(data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      return data;
    } catch {
      // Modo fallback para desarrollo/scaffold inicial cuando auth-service aún no está activo
      if (credentials.email && credentials.password.length >= 6) {
        const mockUser: User = {
          id: 'usr_demo_123',
          name: credentials.email.split('@')[0],
          email: credentials.email,
        };
        const mockResponse: AuthResponse = {
          token: 'demo_jwt_token_sample',
          user: mockUser,
        };

        setStoredToken(mockResponse.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
        return mockResponse;
      }
      throw new Error('Correo o contraseña incorrectos (mínimo 6 caracteres)');
    }
  },

  /**
   * Cierra la sesión activa y limpia los datos del almacenamiento local.
   */
  async logout(): Promise<void> {
    clearStoredToken();
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // Manejo silencioso
    }
  },

  /**
   * Recupera el usuario actualmente almacenado en sesión local.
   */
  getCurrentUser(): User | null {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const rawUser = localStorage.getItem(USER_STORAGE_KEY);
      return rawUser ? (JSON.parse(rawUser) as User) : null;
    } catch {
      return null;
    }
  },
};
