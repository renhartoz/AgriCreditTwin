import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { authService, getUserFromToken } from '@/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUserFromToken());

  const isAuthenticated = user !== null;

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    const decodedUser = result.user || getUserFromToken();
    setUser(decodedUser);
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout }),
    [user, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
