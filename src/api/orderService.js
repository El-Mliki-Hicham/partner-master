import apiClient from './apiClient';
import { API_ROUTES } from './config';

export const orderService = {
    // Get all orders
    getOrders: async () => {
        try {
            const response = await apiClient.get(API_ROUTES.ORDERS);
            // Check for direct array or nested data property
            const orderData = Array.isArray(response?.data) ? response.data : 
                            (Array.isArray(response?.data?.data) ? response.data.data : []);
            return {
                data: orderData,
                status: 'success'
            };
        } catch (error) {
            console.error('Error fetching orders:', error);
            return {
                data: [],
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    // Get orders for a specific user
    getOrderByUserId: async (user_type, user_id) => {
        try {
            const response = await apiClient.get(`${API_ROUTES.ORDERS}/getOrderByUserId`, {
                params: {
                    user_type,
                    user_id
                }
            });
    
            const orderData = Array.isArray(response?.data)
                ? response.data
                : (Array.isArray(response?.data?.data) ? response.data.data : []);
    
            return {
                data: orderData,
                status: 'success'
            };
        } catch (error) {
            console.error('Error fetching user orders:', error);
            return {
                data: [],
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    // Get a specific order
    getOrder: async (orderId) => {
        try {
            const response = await apiClient.get(`${API_ROUTES.ORDERS}/${orderId}`);
            return {
                data: response?.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error fetching order:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    // Create a new order
    createOrder: async (orderData) => {
        try {
            const response = await apiClient.post(API_ROUTES.ORDERS, orderData);
            return {
                data: response?.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error creating order:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue lors de la création'
            };
        }
    },

    // Update an order
    updateOrder: async (orderId, orderData) => {
        try {
            const response = await apiClient.put(`${API_ROUTES.ORDERS}/${orderId}`, orderData);
            return {
                data: response?.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error updating order:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour'
            };
        }
    },

    // Delete an order
    deleteOrder: async (orderId) => {
        try {
            const response = await apiClient.delete(`${API_ROUTES.ORDERS}/${orderId}`);
            return {
                data: response?.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error deleting order:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue lors de la suppression'
            };
        }
    },

    // Accept an order
    acceptOrder: async (orderId) => {
        try {
            const response = await apiClient.post(`${API_ROUTES.PRESTATAIRES}/${orderId.prestataire_id}/accept`, {
                order_id: orderId.id
            });
            return {
                data: response?.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error accepting order:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    // Refuse an order
    refuseOrder: async ({ id, prestataire_id }) => {
        try {
            const response = await apiClient.post(`${API_ROUTES.PRESTATAIRES}/${prestataire_id}/refuse`, { id });
            return {
                data: response?.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error refusing order:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    // Update order status
    updateOrderStatus: async (orderId) => {
        try {
            const response = await apiClient.put(`${API_ROUTES.ORDERS}/${orderId}`, {
                status: "Terminé"
            });
            return {
                data: response?.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error updating order status:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },

    // Get prestataire assigned orders status
    getPrestataire: async (prestataireId) => {
        try {
            const response = await apiClient.get(`${API_ROUTES.PRESTATAIRES}/${prestataireId}`);
            return {
                data: response?.data,
                status: 'success'
            };
        } catch (error) {
            console.error('Error getting prestataire:', error);
            return {
                data: null,
                status: 'error',
                message: error.response?.data?.message || 'Une erreur est survenue'
            };
        }
    },
};
