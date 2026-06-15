import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api/admin` 
        : 'http://localhost:8000/api/admin',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers['x-admin-token'] = token;
    }
    return config;
});

export const authAPI = {
    login: (data) => api.post('/login', data),
};

export const dashboardAPI = {
    getStats: () => api.get('/stats'),
    getActivity: () => api.get('/activity'),
};

export const schemesAPI = {
    getAll: () => api.get('/schemes'),
    create: (data) => api.post('/schemes', data),
    delete: (id) => api.delete(`/schemes/${id}`),
};

export const crawlersAPI = {
    getAll: () => api.get('/crawlers'),
    create: (data) => api.post('/crawlers', data),
    update: (id, data) => api.put(`/crawlers/${id}`, data),
    delete: (id) => api.delete(`/crawlers/${id}`),
    run: (id) => api.post(`/crawlers/${id}/run`),
};

export const chatsAPI = {
    getAll: () => api.get('/chats'),
};

export const pendingSchemesAPI = {
    getAll: () => api.get('/pending-schemes'),
    approve: (id, data) => api.put(`/pending-schemes/${id}/approve`, data),
    reject: (id) => api.delete(`/pending-schemes/${id}`),
};

export const reportsAPI = {
    generate: () => api.get('/reports/generate', { responseType: 'blob' })
};

export default api;
