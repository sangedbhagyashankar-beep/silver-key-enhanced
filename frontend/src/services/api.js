import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(function(config) {
  var token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

var isRefreshing = false;
var failedQueue = [];
function processQueue(error, token) {
  failedQueue.forEach(function(p) { error ? p.reject(error) : p.resolve(token); });
  failedQueue = [];
}

api.interceptors.response.use(
  function(response) { return response; },
  async function(error) {
    var orig = error.config;
    if (error.response?.status === 401 && !orig._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) { failedQueue.push({ resolve, reject }); })
          .then(function(token) { orig.headers.Authorization = 'Bearer ' + token; return api(orig); });
      }
      orig._retry = true;
      isRefreshing = true;
      try {
        var res = await api.post('/auth/refresh');
        var t = res.data.accessToken;
        useAuthStore.getState().setAccessToken(t);
        processQueue(null, t);
        orig.headers.Authorization = 'Bearer ' + t;
        return api(orig);
      } catch (e) {
        processQueue(e, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const roomApi = {
  getAll: function(params) { return api.get('/rooms', { params: params }); },
  getFeatured: function() { return api.get('/rooms/featured'); },
  getOne: function(id) { return api.get('/rooms/' + id); },
  create: function(data) { return api.post('/rooms', data, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  update: function(id, data) { return api.put('/rooms/' + id, data); },
  delete: function(id) { return api.delete('/rooms/' + id); },
  getStats: function() { return api.get('/rooms/stats'); },
};

export const bookingApi = {
  checkAvailability: function(params) { return api.get('/bookings/availability', { params: params }); },
  create: function(data) { return api.post('/bookings', data); },
  confirm: function(data) { return api.post('/bookings/confirm', data); },
  getMyBookings: function() { return api.get('/bookings/my'); },
  getById: function(bookingId) { return api.get('/bookings/' + bookingId); },
  getAllBookings: function(params) { return api.get('/bookings', { params: params }); },
  cancel: function(bookingId, reason) { return api.patch('/bookings/' + bookingId + '/cancel', { reason: reason }); },
  resendConfirmation: function(bookingId, channel) { return api.post('/bookings/' + bookingId + '/resend', { channel: channel }); },
};

export const authApi = {
  register: function(data) { return api.post('/auth/register', data); },
  login: function(data) { return api.post('/auth/login', data); },
  logout: function() { return api.post('/auth/logout'); },
  getMe: function() { return api.get('/auth/me'); },
  forgotPassword: function(email) { return api.post('/auth/forgot-password', { email: email }); },
  resetPassword: function(token, password) { return api.patch('/auth/reset-password/' + token, { password: password }); },
};

export const reviewApi = {
  getAll: function(params) { return api.get('/reviews', { params: params }); },
  create: function(data) { return api.post('/reviews', data); },
  respond: function(id, text) { return api.post('/reviews/' + id + '/respond', { text: text }); },
};

export const adminApi = {
  getDashboard: function() { return api.get('/admin/dashboard'); },
  getRevenueChart: function(year) { return api.get('/admin/revenue-chart', { params: { year: year } }); },
  getOccupancy: function(params) { return api.get('/admin/occupancy', { params: params }); },
};

export const chatbotApi = {
  sendMessage: function(messages, sessionId) { return api.post('/chatbot/chat', { messages: messages, sessionId: sessionId }); },
  recommend: function(data) { return api.post('/chatbot/recommend', data); },
};

export const galleryApi = {
  getAll: function(category) { return api.get('/gallery', { params: { category: category } }); },
  upload: function(data) { return api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }); },
};

export default api;
