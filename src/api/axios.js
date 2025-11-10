import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // sin slash final

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔥 Enviar cookies
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN', // 👈 nombre de cookie que Laravel genera
  xsrfHeaderName: 'X-XSRF-TOKEN', // 👈 header que Laravel espera
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getCsrfCookie = async () => {
  try {
    await api.get('/sanctum/csrf-cookie', { withCredentials: true });
    console.log('✅ CSRF Cookie obtenida correctamente.');
  } catch (error) {
    console.error('❌ Error al obtener la cookie CSRF:', error);
  }
};

export default api;
