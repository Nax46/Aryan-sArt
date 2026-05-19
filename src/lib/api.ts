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

  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      const snippet = text.replace(/<[^>]+>/g, '').trim().slice(0, 120);
      throw new Error(snippet || `Server error (${res.status})`);
    }
  }

  if (!res.ok) {
    throw new Error(
      (typeof data.message === 'string' && data.message) ||
        (typeof data.error === 'string' && data.error) ||
        `Request failed (${res.status})`
    );
  }

  return data;
};
