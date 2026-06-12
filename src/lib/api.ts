export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://www.cgpisoftware.com/cheerytail';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface AdminApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/^\//, '')}`;
}

export interface AuthUser {
  id: string;
  'Full Name': string | null;
  email: string;
  phone: string | null;
  role: string;
  current_address: string | null;
  emergency_contact_number: string | null;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let body: ApiResponse<T>;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Unexpected server response');
  }

  if (!response.ok || body.status !== 'success') {
    throw new ApiError(body.message || 'Request failed');
  }

  return body;
}

export async function adminApiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<AdminApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let body: AdminApiResponse<T>;
  try {
    body = (await response.json()) as AdminApiResponse<T>;
  } catch {
    throw new ApiError('Unexpected server response');
  }

  if (!response.ok || !body.success) {
    throw new ApiError(body.message || 'Request failed');
  }

  return body;
}
