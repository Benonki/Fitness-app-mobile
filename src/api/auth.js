import axiosInstance from './axiosInstance';
import * as SecureStore from 'expo-secure-store';

export const checkStoredData = async (setUser, navigation, setLoading) => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const storedLogin = await SecureStore.getItemAsync('userLogin');
        const AutologinMode = await SecureStore.getItemAsync('AutoLoginMode');

        if (token && storedLogin && AutologinMode === 'true') {
            const response = await axiosInstance.get(`/auth?login=${storedLogin}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setUser(response.data);
                navigation.navigate('DrawerNav');
            }
        }
    } catch (error) {
        console.error('Błąd podczas autologowania:', error);
        await SecureStore.deleteItemAsync('userToken');
    } finally {
        setLoading(false);
    }
};

export const handleLogin = async (login, password, setUser, setMessage, setVisible, navigation, autoLogin) => {
    try {
        const response = await axiosInstance.post('/auth/login', { login, password });
        const { token, user } = response.data;
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userLogin', user.login);
        if(autoLogin) await SecureStore.setItemAsync('AutoLoginMode', 'true');
        setUser(user);
        navigation.navigate('DrawerNav');
    } catch (error) {
        console.error('Błąd logowania:', error);
        setMessage(error.response?.data?.message || 'Błąd podczas logowania');
        setVisible(true);
    }
};
