import { apiRequest, setAuthSession, clearAuthSession, type AuthUser } from '../lib/api';

interface LoginData {
  otp: string;
}

interface VerifyLoginData {
  token: string;
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<string> {
  const res = await apiRequest<LoginData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.data.otp;
}

export async function verifyLoginOtp(email: string, otp: string): Promise<VerifyLoginData> {
  const res = await apiRequest<VerifyLoginData>('/api/auth/verify-login-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
  setAuthSession(res.data.token, res.data.user);
  return res.data;
}

export function logout(): void {
  clearAuthSession();
}
