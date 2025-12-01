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

    // Create a travel plan (JSON)
    // Query: destination, duration_days, budget, budget_level
    // Body: travel_styles, requirements
    createTravelPlan: async (params) => {
        const queryParams = {
            destination: params.destination,
            duration_days: params.duration_days,
            budget: params.budget,
            budget_level: params.budget_level
        };

        const bodyData = {
            travel_styles: params.travel_styles,
            requirements: params.requirements
        };

        const response = await axiosClient.post('/travel/plans', bodyData, {
            params: queryParams
        });
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
