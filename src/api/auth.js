import axiosInstance, { setTemporaryToken } from './axiosInstance';
import { checkAndResetDailyData } from "./accounts";
import * as SecureStore from 'expo-secure-store';
import { Alert } from "react-native";

export const checkStoredData = async (setUser, navigation, setLoading) => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const storedLogin = await SecureStore.getItemAsync('userLogin');

        if (token && storedLogin) {
            const response = await axiosInstance.get(`/auth?login=${storedLogin}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                const userWithReset = await checkAndResetDailyData(response.data.id, response.data)
                setUser(userWithReset);
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
        if(autoLogin) {
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userLogin', user.login);
        } else {
            setTemporaryToken(token);
        }
        const userWithReset = await checkAndResetDailyData(user.id, user);
        setUser(userWithReset);
        navigation.navigate('DrawerNav');
    } catch (error) {
        console.error('Błąd logowania:', error);
        setMessage(error.response?.data?.message || 'Błąd podczas logowania');
        setVisible(true);
    }
};

export const handleLogout = async (setUser, navigation) => {
    try {
        return new Promise((resolve) => {
            Alert.alert(
                'Wylogowanie',
                'Czy na pewno chcesz się wylogować?',
                [
                    {
                        text: 'Anuluj',
                        style: 'cancel',
                        onPress: () => resolve(false),
                    },
                    {
                        text: 'Wyloguj',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await Promise.all([
                                    SecureStore.deleteItemAsync('userToken'),
                                    SecureStore.deleteItemAsync('userLogin'),
                                ]);

                                if (setUser) setUser(null);

                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                                resolve(true);
                            } catch (error) {
                                console.error('Błąd podczas wylogowywania:', error);
                                Alert.alert('Błąd', 'Nie udało się wylogować. Spróbuj ponownie.');
                                resolve(false);
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        });
    } catch (error) {
        console.error('Błąd podczas wyświetlania potwierdzenia:', error);
        return false;
    }
};
