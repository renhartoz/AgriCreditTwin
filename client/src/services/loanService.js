import api from '../lib/api.js';

export async function applyLoan(loanData) {
  const { data } = await api.post('/loans/apply/', loanData);
  return data;
}

export async function getAuditTrail(params = {}) {
  const { data } = await api.get('/loans/audit/', { params });
  return data;
}

export async function getMembers() {
  const { data } = await api.get('/loans/members/');
  return data;
}
