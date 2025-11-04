import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    
    withCredentials: true,
    
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(config => {
    
    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null;
        }
        return null;
    };

    const token = getCookie('XSRF-TOKEN');
    
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default api;