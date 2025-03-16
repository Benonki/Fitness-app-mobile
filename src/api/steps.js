import axiosInstance from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkAndResetSteps = async (userId) => {
    try {
        const storedDate = await AsyncStorage.getItem(`lastSyncDate_${userId}`);
        const currentDate = new Date().toISOString().split('T')[0];

        if (storedDate !== currentDate) {
            await axiosInstance.patch(`/users/${userId}`, { zrKroki: 0 });
            await AsyncStorage.setItem(`lastSyncDate_${userId}`, currentDate);
            return 0;
        }

        return null;
    } catch (error) {
        console.error('Error checking or resetting steps:', error);
        return null;
    }
};

export const loadStepData = async (userId) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data?.zrKroki || 0;
    } catch (error) {
        console.error('Error fetching step data:', error);
        return 0;
    }
};

export const saveSteps = async (userId, newSteps, lastSavedStep) => {
    try {
        if ((newSteps - lastSavedStep) >= 20) {
            await axiosInstance.patch(`/users/${userId}`, { zrKroki: newSteps });
            return newSteps;
        }
        return lastSavedStep;
    } catch (error) {
        console.error('Error saving step count:', error);
        return lastSavedStep;
    }
};
