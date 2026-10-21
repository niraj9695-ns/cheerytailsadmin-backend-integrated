import { apiRequest, setAuthSession, clearAuthSession, type AuthUser } from '../lib/api';

interface LoginData {
  token: string;
  user: AuthUser;
}

interface VerifyLoginData {
  token: string;
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<LoginData> {
  const res = await apiRequest<LoginData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthSession(res.data.token, res.data.user);
  return res.data;
}

export async function verifyLoginOtp(email: string, otp: string): Promise<VerifyLoginData> {
  const res = await apiRequest<VerifyLoginData>('/api/auth/verify-login-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
  setAuthSession(res.data.token, res.data.user);
  return res.data;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' }, true);
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    clearAuthSession();
  }
}
