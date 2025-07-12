import apiClient from './apiClient';
import { API_ROUTES } from './config';

export const userService = {
    // Get current user's profile
    getCurrentUser: async () => {
        try {
            const response = await apiClient.get(API_ROUTES.USER);
            // The user data is directly in response.data, not nested
            return {
                data: response?.data || null,
                status: 'success'
            };
        } catch (error) {
            console.error('Error fetching current user:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    // Get user's statistics
    getUserStats: async () => {
        try {
            const ordersResponse = await apiClient.get(API_ROUTES.ORDERS);
            const orders = Array.isArray(ordersResponse?.data) ? ordersResponse.data : 
                          (Array.isArray(ordersResponse?.data?.data) ? ordersResponse.data.data : []);
            
            return {
                stats: {
                    ongoingInterventions: orders.filter(order => order.status === 'ongoing').length,
                    completedInterventions: orders.filter(order => order.status === 'completed').length,
                    totalInvoices: orders.filter(order => order.invoice_status).length,
                },
                status: 'success'
            };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return {
                stats: {
                    ongoingInterventions: 0,
                    completedInterventions: 0,
                    totalInvoices: 0,
                },
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    // Update user profile
    updateProfile: async (userData) => {
        try {
            const response = await apiClient.put(`${API_ROUTES.USERS}/profile`, userData);
            return {
                data: response?.data?.data || null,
                status: 'success'
            };
        } catch (error) {
            console.error('Error updating profile:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },
    // ... existing code ...

    // Upload document for a user
    uploadDocument: async (userId, formData) => {
        try {
            const response = await apiClient.post(`${API_ROUTES.PRESTATAIRES}/${userId}/documents`, formData);
            return {
                data: response.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error uploading document:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },
    // Get user documents
    getDocuments: async (prestataireId) => {
        try {
            const response = await apiClient.get(`/prestataires/${prestataireId}/documents`);
            return {
                data: response?.data || [],
                status: 'success'
            };
        } catch (error) {
            console.error('Error fetching documents:', error);
            return {
                data: [],
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    
};
