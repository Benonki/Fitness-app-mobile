import axiosInstance from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadStepData = async (userId) => {
    try {
        const response = await axiosInstance.get(`/steps/${userId}`);
        return response.data?.zrKroki || 0;
    } catch (error) {
        console.error('Error fetching step data:', error);
        return 0;
    }
};

export const saveSteps = async (userId, newSteps) => {
    try {
        await axiosInstance.patch(`/steps/${userId}/update`, { zrKroki: newSteps });
        return newSteps;
    } catch (error) {
        console.error('Error saving step count:', error);
        return lastSavedStep;
    }
};
