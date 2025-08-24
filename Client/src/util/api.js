// src/utils/axios.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRequest =
            originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post('/api/users/refresh');

                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                try {
                    await api.get('/api/users/logout');
                } catch (e) {
                    console.warn('Logout failed:', e);
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const apiGet = async (endpoint, config = {}) => {
    const response = await api.get(endpoint, config);
    return response.data;
};

export const apiPost = async (endpoint, data = {}, config = {}) => {
    const response = await api.post(endpoint, data, config);
    return response.data;
};

export const apiPut = async (endpoint, data = {}, config = {}) => {
    const response = await api.put(endpoint, data, config);
    return response.data;
};

export const apiPatch = async (endpoint, data = {}, config = {}) => {
    const response = await api.patch(endpoint, data, config);
    return response.data;
};

export const apiDelete = async (endpoint, config = {}) => {
    const response = await api.delete(endpoint, config);
    return response.data;
};

// User API
export const userApi = {
    login: (credentials) => apiPost('/api/users/login', credentials),
    register: (userData) => apiPost('/api/users/register', userData),
    getProfile: () => apiGet('/api/users/me'),
    logout: () => apiGet('/api/users/logout'),
    isLogin: () => apiGet('/api/users/islogin'),
};

// Lead API
export const leadApi = {
    getAll: (params = {}) => apiGet('/api/leads', params),
    getById: (id) => apiGet(`/api/leads/${id}`),
    create: (leadData) => apiPost('/api/leads', leadData),
    update: (id, leadData) => apiPut(`/api/leads/${id}`, leadData),
    delete: (id) => apiDelete(`/api/leads/${id}`),
    getByUser: (userId) => apiGet(`/api/leads/user/${userId}`),
};

export default api;
