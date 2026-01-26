import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get cookie value
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

// Request interceptor to add CSRF token for non-GET requests
api.interceptors.request.use((config) => {
    if (config.method !== 'get') {
        const token = getCookie('XSRF-TOKEN-V2');
        if (token) {
            config.headers['X-XSRF-TOKEN'] = token;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
