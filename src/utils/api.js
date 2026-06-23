import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('salon_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthAttempt = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('salon_token');
      localStorage.removeItem('salon_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const message = error?.response?.data?.message;
  if (typeof message !== 'string' || message.length > 180) return fallback;
  if (/stack|mongodb|mongoose|cast to objectid|econn|node_modules|syntaxerror/i.test(message)) return fallback;
  return message;
}

export default api;
