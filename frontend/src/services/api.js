import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getOne: (id) => api.get(`/bookings/${id}`)
};

export const adminService = {
  getOrders: () => api.get('/admin/orders'),
  getMetrics: () => api.get('/admin/dashboard/metrics'),
  approveOrder: (id) => api.post(`/admin/orders/${id}/approve`),
  updateStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data)
};

export default api;
