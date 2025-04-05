import axiosInstance from './axiosInstance';

export const loadNotifications = async (userId) => {
    try {
        const response = await axiosInstance.get(`/notifications/${userId}`);
        return response.data || [];
    } catch (error) {
        console.error('Błąd ładowania powiadomień:', error.response?.data || error);
        throw error;
    }
};

export const addNotification = async (userId, newNotification) => {
    try {
        const response = await axiosInstance.post(`/notifications/${userId}/add`, newNotification);
        return response.data;
    } catch (error) {
        console.error('Błąd dodawania powiadomienia:', error.response?.data || error);
        throw error;
    }
};

export const deleteNotification = async (userId, notificationId) => {
    try {
        const response = await axiosInstance.delete(`/notifications/${userId}/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd usuwania powiadomienia:', error.response?.data || error);
        throw error;
    }
};
