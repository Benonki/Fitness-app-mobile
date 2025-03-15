import axiosInstance from './axiosInstance';
import * as SecureStore from 'expo-secure-store';

export const checkStoredData = async (setUser, navigation, setLoading) => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const storedLogin = await SecureStore.getItemAsync('userLogin');
        const storedPassword = await SecureStore.getItemAsync('userPassword');

        if (token && storedLogin && storedPassword) {
            const response = await axiosInstance.get('/users');
            const users = response.data;

            const user = users.find(
                (user) => user.login === storedLogin && user.haslo === storedPassword
            );

            if (user) {
                setUser(user);
                navigation.navigate('DrawerNav');
            }
        }
    } catch (error) {
        console.error('Błąd podczas autologowania:', error);
    } finally {
        setLoading(false);
    }
};

export const saveData = async (token, login, password, autoLogin) => {
    try {
        if (autoLogin) {
            await SecureStore.setItemAsync('userToken', token);
        }
    } catch (error) {
        console.error('Błąd podczas zapisywania danych:', error);
    } finally {
        await SecureStore.setItemAsync('userLogin', login);
        await SecureStore.setItemAsync('userPassword', password);
    }
};

export const handleLogin = async (login, password, setUser, setMessage, setVisible, navigation) => {
    if (!login || !password) {
        setMessage('Wszystkie pola muszą być wypełnione');
        setVisible(true);
        return;
    }

    try {
        const response = await axiosInstance.get('/users');
        const users = response.data;
        const user = users.find(user => user.login === login);

        if (user && user.haslo === password) {
            const token = `${Date.now()}`;
            await saveData(token, login, password, true);

            setUser(user);
            setMessage('Zalogowano pomyślnie');
            setVisible(true);
            navigation.navigate('DrawerNav');
        } else {
            setMessage('Nieprawidłowy login lub hasło');
            setVisible(true);
        }
    } catch (error) {
        console.error('Błąd podczas pobierania użytkowników:', error);
        setMessage('Błąd podczas logowania');
        setVisible(true);
    }
};
