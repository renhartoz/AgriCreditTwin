import api from '@/lib/api';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login/', { email, password });
    localStorage.setItem(TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_KEY, data.refresh);
    return data;
  },

  async registerTenant(formData) {
    const { data } = await api.post('/auth/register-tenant/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
