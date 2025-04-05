import axiosInstance from './axiosInstance';

export const getUserData = async (userId) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        throw new Error('Nie udało się pobrać danych użytkownika');
    }
};

export const updateUserData = async (userId, updatedData) => {
    try {
        const response = await axiosInstance.put(`/users/${userId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Błąd podczas aktualizacji danych użytkownika:', error);
        throw new Error('Nie udało się zaktualizować danych użytkownika');
    }
};