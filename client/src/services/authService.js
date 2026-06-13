import api from '@/lib/api';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getUserFromToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const payload = decodeJwt(token);
  if (!payload) return null;

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return null;
  }

  return {
    userId: payload.user_id,
    username: payload.username || '',
    email: payload.email || '',
    name: payload.name || payload.username || '',
    role: payload.role || null,
    tenantId: payload.tenant_id || null,
    tenantName: payload.tenant_name || null,
  };
}

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login/', { username: email, password });
    localStorage.setItem(TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_KEY, data.refresh);
    
    const user = getUserFromToken();
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { ...data, user };
  },

  async registerTenant(formData) {
    const { data } = await api.post('/auth/register-tenant/', formData);
    return data;
  },

  async register({ username, email, password, role, tenantId }) {
    const payload = { username, email, password, role };
    if (tenantId) payload.tenant_id = tenantId;
    const { data } = await api.post('/auth/register/', payload);
    return data;
  },

  async verifyEmail(uidb64, token) {
    const { data } = await api.post('/auth/verify-email/', { uidb64, token });
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated() {
    const user = getUserFromToken();
    return user !== null;
  },
};
