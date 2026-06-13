import api from '../lib/api.js';

export async function applyLoan(loanData) {
  const { data } = await api.post('/api/loans/apply/', loanData);
  return data;
}

export async function getAuditTrail(params = {}) {
  const { data } = await api.get('/api/loans/audit/', { params });
  return data;
}
