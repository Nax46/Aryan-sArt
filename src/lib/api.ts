export const getApiUrl = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  if (hostname === 'www.oncanvas.in' || hostname === 'oncanvas.in') {
    return '/api';
  }

  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }

  return '/api';
};

export const getAuthToken = () =>
  localStorage.getItem('canvas_token') || sessionStorage.getItem('canvas_token');

export const authFetch = async (path: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiUrl()}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};
