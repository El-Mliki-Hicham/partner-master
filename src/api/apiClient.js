import axios from 'axios';
import { authService } from './auth';
import { API_ROUTES } from './config';
const API_BASE_URL = 'https://servicepro-api.canbridgeapp.com/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
    }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error (e.g., token expired)
            authService.login();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
