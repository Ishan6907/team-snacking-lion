import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, AuthState } from '@/types/auth';
import { apiClient } from '@/api/client';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // On mount, check for a stored token (demo: localStorage)
  useEffect(() => {
    const token = localStorage.getItem('paimana_token');
    const userJson = localStorage.getItem('paimana_user');
    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      setState({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // POST to /auth/login — for demo, simulate success
    try {
      const { data } = await apiClient.post<{ user: User; accessToken: string }>(
        '/auth/login',
        credentials,
      );
      const { user, accessToken } = data;
      localStorage.setItem('paimana_token', accessToken);
      localStorage.setItem('paimana_user', JSON.stringify(user));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setState({ user, accessToken, isAuthenticated: true, isLoading: false });
    } catch {
      // Demo fallback: fake login if backend not available
      const fakeUser: User = {
        id: 'demo-1',
        email: credentials.email,
        name: 'Demo Analyst',
        role: 'analyst',
      };
      const fakeToken = 'demo-jwt-token';
      localStorage.setItem('paimana_token', fakeToken);
      localStorage.setItem('paimana_user', JSON.stringify(fakeUser));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${fakeToken}`;
      setState({ user: fakeUser, accessToken: fakeToken, isAuthenticated: true, isLoading: false });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('paimana_token');
    localStorage.removeItem('paimana_user');
    delete apiClient.defaults.headers.common['Authorization'];
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
