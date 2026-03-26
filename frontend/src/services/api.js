import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'
// const API_BASE_URL = 'https://courierhub-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const bookingService = {
  create: (data) => api.post('/bookings/create', data),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  downloadLabel: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/label`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `label-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export default api
