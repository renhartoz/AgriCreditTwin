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

export async function getCommodities() {
  const { data } = await api.get('/logistics/commodities/');
  return data;
}

export async function getCommodityLogs() {
  const { data } = await api.get('/logistics/logs/');
  return data;
}

export async function recordCommodityLog(logData) {
  const { data } = await api.post('/logistics/logs/', logData);
  return data;
}

export async function getOperators() {
  const { data } = await api.get('/auth/operators/');
  return data;
}

export async function inviteOperator(payload) {
  const { data } = await api.post('/auth/invite-operator/', payload);
  return data;
}
