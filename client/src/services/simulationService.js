import api from '../lib/api.js';

export async function getTrustScore(nik) {
  const { data } = await api.get(`/members/${nik}/trust-score/`);
  return data;
}

export async function runCashflowProjection(params) {
  const { data } = await api.post('/project-cashflow/', params);
  return data;
}
