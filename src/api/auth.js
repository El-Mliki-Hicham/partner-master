import axios from 'axios';
import { API_ROUTES } from './config';
import { getDecryptedTokenFromUrl } from '../utils/tokenHandler';

const AUTH_TOKEN_KEY = 'auth_token';
const MAIN_SERVICE_URL = 'https://service-pro-admin-master.vercel.app';

// Auth state change listeners
const authListeners = new Set();

// Check for logout parameter and redirect
if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = MAIN_SERVICE_URL;
    } else {
        initializeAuth();
    }
}

async function initializeAuth() {
    try {
        const token = await getDecryptedTokenFromUrl();
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeettttttttttttttttttttttttttttttttttt");
        console.log(token);
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeettttttttttttttttttttttttttttttttttt");
        
        if (token) {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Clean URL after getting token
            const newUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, newUrl);
            // Notify listeners of auth change
            notifyAuthStateChange();
        }
    } catch (error) {
        console.error('Error initializing auth:', error);
    }
}

// Notify all listeners of auth state change
function notifyAuthStateChange() {
    authListeners.forEach(listener => listener());
}

export const authService = {
    // Subscribe to auth state changes
    subscribe(listener) {
        authListeners.add(listener);
        return () => authListeners.delete(listener);
    },

    // Login user
    async login(email, password) {
        try {
            console.log('Attempting login with:', { email });
            
            // Validate input
            if (!email || !password) {
                //  this.logout();
                throw new Error('Email and password are required');
                
            }

            // Send the request with the exact format
            const response = await axios.post(API_ROUTES.LOGIN, {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Login response:', response.data);

            // Get token from response data
            const token = response.data?.token || response.data?.data?.token || response.data?.access_token;
            
            if (token) {
                // Store the token
                localStorage.setItem(AUTH_TOKEN_KEY, token);
                
                // Set the default Authorization header for all future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Notify listeners of auth state change
                notifyAuthStateChange();
                
                return response.data;
            }

            if (response.data?.error) {
                throw new Error(response.data.error);
            }

            throw new Error('No token received from server');
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers,
                }
            });

            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data?.message || error.response.data?.error || 'Login failed',
                    details: error.response.data
                };
            } else if (error.request) {
                throw {
                    message: 'No response received from server',
                    details: error.request
                };
            } else {
                throw {
                    message: error.message || 'Login request failed',
                    details: error
                };
            }
        }
    },

    // Logout user and redirect to main domain
    logout() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        delete axios.defaults.headers.common['Authorization'];
        notifyAuthStateChange();
        window.location.href = 'https://service-pro-admin-master.vercel.app?logout=true';
    },

    // Get auth token
    getToken() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }
};
