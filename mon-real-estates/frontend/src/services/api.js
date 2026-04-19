import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  createAdmin: (adminData) => api.post('/auth/create-admin', adminData),
  getAllAdmins: () => api.get('/auth/admins'),
  updateAdmin: (id, adminData) => api.put(`/auth/admins/${id}`, adminData),
  deleteAdmin: (id) => api.delete(`/auth/admins/${id}`),
};

// Properties API methods
export const propertiesAPI = {
  getAll: () => api.get('/properties'),
  getById: (id) => api.get(`/properties/${id}`),
  getFeatured: () => api.get('/properties/featured'),
  create: (propertyData, isFormData = false) => {
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.post('/properties', propertyData, config);
  },
  update: (id, propertyData, isFormData = false) => {
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.put(`/properties/${id}`, propertyData, config);
  },
  delete: (id) => api.delete(`/properties/${id}`),
};

// Contacts API methods
export const contactsAPI = {
  getAll: () => api.get('/contacts'),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (contactData) => api.post('/contacts', contactData),
  update: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  delete: (id) => api.delete(`/contacts/${id}`),
};

export default api;
