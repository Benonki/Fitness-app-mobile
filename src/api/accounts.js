import axiosInstance from './axiosInstance';
import * as SecureStore from 'expo-secure-store';

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

export const logoutUser = async (setUser, navigation) => {
    try {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userLogin');
        await SecureStore.deleteItemAsync('userPassword');
        setUser(null);
        navigation.navigate('Login');
    } catch (error) {
        console.error('Błąd podczas wylogowywania użytkownika:', error);
        throw new Error('Nie udało się wylogować użytkownika');
    }
};