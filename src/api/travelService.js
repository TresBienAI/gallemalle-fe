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
    },

    // Update hotel and recalculate itinerary
    updateHotel: async (params) => {
        const response = await axiosClient.post('/travel/plans/update-hotel', {
            destination: params.destination,
            travel_styles: params.travel_styles || [],
            duration_days: params.duration_days,
            budget: params.budget || "50만원",
            selected_places: params.selected_places,
            new_hotel: params.new_hotel,
            requirements: params.requirements || []
        });
        return response.data;
    },

    // Replace a place and recalculate day schedule
    replacePlace: async (params) => {
        const response = await axiosClient.post('/travel/plans/replace-place', {
            day: params.day,
            old_place: params.old_place,
            new_place: params.new_place,
            all_places: params.all_places,
            duration_days: params.duration_days
        });
        return response.data;
    }
};
