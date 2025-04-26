import axiosInstance from './axiosInstance';

export const getUserData = async (userId) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const userData = response.data;

        const rawBaseUrl = axiosInstance.defaults.baseURL.replace(/\/api\/?$/, '');

        if (userData.imageUri && !userData.imageUri.startsWith('http')) {
            userData.imageUri = `${rawBaseUrl}${userData.imageUri}`;
        }

        return userData;
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

export const checkAndResetDailyData  = async (userId, currentUserData) => {
    try {
        if (currentUserData) {
            const today = new Date().toISOString().split('T')[0];
            const userSyncDate = new Date(currentUserData.lastSyncDate).toISOString().split('T')[0];

            if (userSyncDate === today) {
                return currentUserData;
            }
        }
        const response = await axiosInstance.patch(`/users/${userId}/reset-daily`);
        console.log('Dzienne resetowanie zwróciło:', response.data);

        if (currentUserData) {
            return {
                ...currentUserData,
                ...response.data,
                lastSyncDate: response.data.lastSyncDate || new Date().toISOString()
            };
        }

        return response.data;

    } catch (error) {
        console.error('Błąd podczas resetowania danych dziennych:', error);
        if (currentUserData) return currentUserData;
        throw new Error('Nie udało się zresetować danych dziennych');
    }
};