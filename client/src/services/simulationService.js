import api from '../lib/api.js';

export async function getTrustScore(nik) {
  const { data } = await api.get(`/api/members/${nik}/trust-score/`);
  return data;
}
