import axiosClient from './axiosClient';

export const travelService = {
    // Get available travel types (themes)
    getTravelTypes: async () => {
        const response = await axiosClient.get('/travel/types');
        return response.data;
    },

    // Get popular destinations
    getDestinations: async () => {
        const response = await axiosClient.get('/travel/destinations');
        return response.data;
    },

    // Create a travel plan
    // data: { destination: string, duration: string, travelers: string, style: string[], ... }
    createTravelPlan: async (data) => {
        const response = await axiosClient.post('/travel/plan', data);
        return response.data;
    },

    // Chat with the AI assistant
    chat: async (message, thread_id = null, user_id = null) => {
        const response = await axiosClient.post('/chat/travel', {
            message,
            thread_id,
            user_id
        });
        return response.data;
    }
};
