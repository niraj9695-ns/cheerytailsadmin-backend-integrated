import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { getStoredUser, getToken, type AuthUser } from '../lib/api';
import * as authService from '../services/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string, password: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getToken());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(token),
      async login(email, password) {
        const otp = await authService.login(email, password);
        return otp;
      },
      async verifyOtp(email, otp) {
        const { token: newToken, user: newUser } = await authService.verifyLoginOtp(email, otp);
        setToken(newToken);
        setUser(newUser);
      },
      async resendOtp(email, password) {
        const otp = await authService.login(email, password);
        return otp;
      },
      logout() {
        authService.logout();
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
