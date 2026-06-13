import api from '../lib/api.js';

export async function getPortfolio() {
  const { data } = await api.get('/api/portfolio/');
  return data;
}
