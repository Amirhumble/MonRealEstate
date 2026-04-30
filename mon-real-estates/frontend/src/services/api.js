import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Token management
let accessToken = localStorage.getItem('accessToken');
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/auth/refresh');
        const { accessToken: newAccessToken } = response.data;
        
        // Update stored token
        accessToken = newAccessToken;
        localStorage.setItem('accessToken', newAccessToken);
        
        // Update default header
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Process queued requests
        processQueue(null, newAccessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        processQueue(refreshError, null);
        handleAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other 401 errors (invalid token, etc.)
    if (error.response?.status === 401) {
      handleAuthFailure();
    }

    return Promise.reject(error);
  }
);

// Handle authentication failure
const handleAuthFailure = () => {
  accessToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
  
  // Dispatch custom event for auth state change
  window.dispatchEvent(new CustomEvent('auth:logout'));
  
  // Redirect to login if not already there
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Update access token
export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem('accessToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Clear access token
export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('accessToken');
  delete api.defaults.headers.common['Authorization'];
};

// Authentication API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  logoutAll: () => api.post('/auth/logout-all'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData, isFormData = false) => {
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.put('/auth/update-profile', profileData, config);
  },
  toggleSavedProperty: (propertyId) => api.post(`/auth/toggle-saved/${propertyId}`),
  getSavedProperties: () => api.get('/auth/saved-properties'),
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

// Projects API methods
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  getFeatured: () => api.get('/projects/featured'),
  getByStatus: (status) => api.get(`/projects/status/${status}`),
  create: (projectData, isFormData = false) => {
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.post('/projects', projectData, config);
  },
  update: (id, projectData, isFormData = false) => {
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.put(`/projects/${id}`, projectData, config);
  },
  delete: (id) => api.delete(`/projects/${id}`),
};

export default api;
