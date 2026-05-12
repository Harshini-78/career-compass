import axios from 'axios';

const API_URL = 'https://career-compass-jinm.onrender.com/api/';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                const res = await axios.post(`${API_URL}token/refresh/`, { refresh: refreshToken });

                if (res.status === 200) {
                    localStorage.setItem('access', res.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                }
            } catch {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;