import axiosInstance from './axiosInstance';

export const loadNotifications = async (userId) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data.notifications || [];
    } catch (error) {
        console.error('Błąd ładowania powiadomień:', error);
        throw error;
    }
};

export const addNotification = async (userId, newNotification) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const user = response.data;
        const updatedNotifications = [...(user.notifications || []), { ...newNotification, date: new Date().toISOString() }];

        await axiosInstance.patch(`/users/${userId}`, { notifications: updatedNotifications });

        return updatedNotifications;
    } catch (error) {
        console.error('Błąd dodawania powiadomienia:', error);
        throw error;
    }
};

export const deleteNotification = async (userId, notificationId) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const user = response.data;
        const updatedNotifications = user.notifications.filter((notif) => notif.id !== notificationId);

        await axiosInstance.patch(`/users/${userId}`, { notifications: updatedNotifications });

        return updatedNotifications;
    } catch (error) {
        console.error('Błąd usuwania powiadomienia:', error);
        throw error;
    }
};