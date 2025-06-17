import { API_ROUTES } from './config';
import apiClient from './apiClient';

export const quoteService = {
    getQuotes: async () => {
        try {
            const response = await apiClient.get(API_ROUTES.QUOTES);
            return response.data;
        } catch (error) {
            console.error('Error fetching quotes:', error);
            throw error;
        }
    },

    getAcceptedQuotes: async () => {
        try {
            const response = await apiClient.get(API_ROUTES.QUOTES);
            return response.data.filter(quote => quote.status === 'accepted');
        } catch (error) {
            console.error('Error fetching accepted quotes:', error);
            throw error;
        }
    }
};
