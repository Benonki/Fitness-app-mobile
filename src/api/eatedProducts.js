import axiosInstance from './axiosInstance';

export const loadProductsFromAPI = async (userId) => {
    try {
        const response = await axiosInstance.get(`/user-products/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd podczas ładowania produktów:', error);
        throw error;
    }
};

export const updateUserProducts = async (userId, products) => {
    try {
        await axiosInstance.patch(`/user-products/${userId}/update`, { eatenProducts: products });
    } catch (error) {
        console.error('Błąd podczas aktualizacji produktów:', error);
        throw error;
    }
};