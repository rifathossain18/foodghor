const BASE = '/api';

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${txt}`);
  }
  return res.json();
}

export const api = {
  products: {
    list: () => call<any[]>('/products'),
    save: (p: any) => call<any>('/products', { method: 'POST', body: JSON.stringify(p) }),
    remove: (id: string) => call<any>(`/products/${id}`, { method: 'DELETE' }),
  },
  banners: {
    list: () => call<any[]>('/banners'),
    save: (b: any) => call<any>('/banners', { method: 'POST', body: JSON.stringify(b) }),
    remove: (id: string) => call<any>(`/banners/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list: () => call<any[]>('/orders'),
    save: (o: any) => call<any>('/orders', { method: 'POST', body: JSON.stringify(o) }),
    remove: (id: string) => call<any>(`/orders/${id}`, { method: 'DELETE' }),
  },
  users: {
    list: () => call<any[]>('/users'),
    save: (u: any) => call<any>('/users', { method: 'POST', body: JSON.stringify(u) }),
    remove: (id: string) => call<any>(`/users/${id}`, { method: 'DELETE' }),
  },
  settings: {
    get: () => call<any>('/settings'),
    save: (s: any) => call<any>('/settings', { method: 'PUT', body: JSON.stringify(s) }),
  },
  courier: {
    get: () => call<any>('/courier'),
    save: (c: any) => call<any>('/courier', { method: 'PUT', body: JSON.stringify(c) }),
  },
  pixel: {
    get: () => call<any>('/pixel'),
    save: (p: any) => call<any>('/pixel', { method: 'PUT', body: JSON.stringify(p) }),
  },
};