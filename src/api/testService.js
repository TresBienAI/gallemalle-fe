import axiosClient from './axiosClient';

export const testBackendConnection = async () => {
    try {
        const response = await axiosClient.get('/api/test'); // Adjust endpoint as needed
        return response.data;
    } catch (error) {
        console.error('Failed to connect to backend:', error);
        throw error;
    }
};
