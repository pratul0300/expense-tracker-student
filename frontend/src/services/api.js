import axios from 'axios';

/** Normalize backend root; axios paths use /expenses, /summary, … under /api. */
function resolvedApiBase() {
  const raw = typeof import.meta.env.VITE_API_URL === 'string' ? import.meta.env.VITE_API_URL.trim() : '';
  if (!raw) return '/api';
  const root = raw.replace(/\/+$/, '');
  const lower = root.toLowerCase();
  if (lower.endsWith('/api')) return root;
  return `${root}/api`;
}

export const api = axios.create({
  baseURL: resolvedApiBase(),
  timeout: 120000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const EXPENSE_CATEGORY_OPTIONS = [
  { value: 'FOOD', label: 'Food & groceries' },
  { value: 'TRAVEL', label: 'Travel & transit' },
  { value: 'SHOPPING', label: 'Shopping & supplies' },
  { value: 'BILLS', label: 'Bills & rent' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'OTHER', label: 'Other' },
];

export async function fetchExpenses({ year, month, category } = {}) {
  const params = {};
  if (year != null && year !== '') params.year = year;
  if (month != null && month !== '') params.month = month;
  if (category) params.category = category;
  const { data } = await api.get('/expenses', { params });
  return Array.isArray(data) ? data : [];
}

export async function fetchExpense(id) {
  const { data } = await api.get(`/expenses/${id}`);
  return data;
}

export async function createExpense(payload) {
  const { data } = await api.post('/expenses', payload);
  return data ?? null;
}

export async function updateExpense(id, payload) {
  const { data } = await api.put(`/expenses/${id}`, payload);
  return data ?? null;
}

export async function deleteExpense(id) {
  await api.delete(`/expenses/${id}`);
}

export async function fetchMonthlySummary({ year, month }) {
  const { data } = await api.get('/summary/monthly', { params: { year, month } });
  return data;
}

export async function fetchCategoryBreakdown({ year, month }) {
  const { data } = await api.get('/summary/category', { params: { year, month } });
  return data;
}

export async function downloadExpenseCsv(filters, filename = 'expenses.csv') {
  const params = {};
  if (filters.year != null && filters.year !== '') params.year = filters.year;
  if (filters.month != null && filters.month !== '') params.month = filters.month;
  if (filters.category) params.category = filters.category;

  const res = await api.get('/export/csv', {
    params,
    responseType: 'blob',
  });

  const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
