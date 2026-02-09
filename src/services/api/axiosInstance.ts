import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '../../store/store';

const axiosInstance: AxiosInstance = axios.create({
    timeout: 30000, // Increased timeout for Render free tier
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
            config.headers.Authorization = token;
        }

        // CRITICAL: If sending FormData, we MUST remove the default Content-Type header
        // to let the browser/native layer set it with the correct boundary.
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors (e.g., token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // You can implement refresh token logic here
            // For now, let's just logout or handle the error
            console.log('Unauthorized, logging out...');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
