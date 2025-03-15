import axiosInstance from './axiosInstance';

export const loadProductsFromAPI = async (userId) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd podczas ładowania produktów:', error);
        throw error;
    }
};

export const updateUserProducts = async (userId, products) => {
    try {
        await axiosInstance.patch(`/users/${userId}`, { eatenProducts: products });
    } catch (error) {
        console.error('Błąd podczas aktualizacji produktów:', error);
        throw error;
    }
};

export const clearUserProducts = async (userId) => {
    try {
        await axiosInstance.patch(`/users/${userId}`, { eatenProducts: [] });
    } catch (error) {
        console.error('Błąd podczas czyszczenia produktów:', error);
        throw error;
    }
};