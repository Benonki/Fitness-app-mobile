import axiosInstance from './axiosInstance';

export const isLoginAvailable = async (login) => {
    try {
        const response = await axiosInstance.get('/auth/check-login', {
            params: { login }
        });
        return response.data.available; // Zwraca true/false w zależności od dostępności
    } catch (error) {
        console.error('Błąd podczas sprawdzania dostępności loginu:', error);
        return false;
    }
}

export const registerUser = async (userData, acceptedTerms, setMessage, setVisible, navigation) => {
    if (!userData.login || !userData.password || !userData.confirmPassword || !userData.imie || !userData.nazwisko || !userData.waga || !userData.wzrost || !userData.kroki || !userData.dataUr || !userData.iloscTr) {
        setMessage('Wszystkie pola muszą być wypełnione');
        setVisible(true);
        return;
    }

    if (userData.password !== userData.confirmPassword) {
        setMessage('Hasła nie pasują');
        setVisible(true);
        return;
    }

    const loginAvailable = await isLoginAvailable(userData.login);
    if (!loginAvailable) {
        setMessage('Login jest już zajęty');
        setVisible(true);
        return;
    }

    if (!acceptedTerms) {
        setMessage('Musisz zaakceptować warunki użytkowania');
        setVisible(true);
        return;
    }

    if (parseFloat(userData.waga) <= 0 || parseFloat(userData.wzrost) <= 0) {
        setMessage('Waga, wzrost muszą być większe niż 0');
        setVisible(true);
        return false;
    }

    if (parseInt(userData.kroki) < 0 || parseInt(userData.iloscTr) < 0) {
        setMessage('Liczba kroków i liczba treningów nie mogą być ujemne');
        setVisible(true);
        return false;
    }

    const newUser = {
        login: userData.login,
        haslo: userData.password,
        imie: userData.imie,
        nazwisko: userData.nazwisko,
        waga: parseFloat(userData.waga),
        wzrost: parseFloat(userData.wzrost),
        kroki: parseInt(userData.kroki),
        zrKroki: 0,
        cel: userData.cel,
        iloscTr: parseInt(userData.iloscTr),
        plec: userData.plec,
        dataUr: userData.dataUr,
        imageUri: userData.imageUri || "",
        notifications: [],
        eatenProducts: []
    };

    try {
        await axiosInstance.post('/users', newUser);
        setMessage('Rejestracja zakończona sukcesem');
        setVisible(true);
        navigation.navigate('Login');
    } catch (error) {
        console.error('Błąd podczas zapisywania danych logowania:', error);
        console.error('Pełny błąd:', error.response?.data || error.message);
        setMessage('Wystąpił błąd podczas rejestracji');
        setVisible(true);
    }
};