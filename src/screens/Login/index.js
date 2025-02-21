import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Snackbar, Checkbox } from 'react-native-paper';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import styles from './StyleSheet.js';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import config from '../../../JsonIpConfig.js';
import { UserContext } from '../../context/UserContext';

const LoginScreen = ({ navigation }) => {
    const { setUser } = useContext(UserContext);
    const [ login, setLogin ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ autoLogin, setAutoLogin ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(true);

    const checkStoredData = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const storedLogin = await SecureStore.getItemAsync('userLogin');
            const storedPassword = await SecureStore.getItemAsync('userPassword');

            if (token && storedLogin && storedPassword) {
                const response = await axios.get(`${config.apiBaseUrl}/users`);
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

    useEffect(() => {
        checkStoredData();
    }, []);

    const saveData = async (token, login, password) => {
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

    const handleLogin = () => {
        if (!login || !password) {
            setMessage('Wszystkie pola muszą być wypełnione');
            setVisible(true);
            return;
        }

        axios.get(`${config.apiBaseUrl}/users`)
            .then(function (response) {
                const users = response.data;
                const user = users.find(user => user.login === login);

                if (user && user.haslo === password) {
                    const token = `${Date.now()}`;
                    saveData(token, login, password)
                        .then(() => {
                            setUser(user);
                            setMessage('Zalogowano pomyślnie');
                            setVisible(true);
                            navigation.navigate('DrawerNav');
                        })
                        .catch(() => {
                            setMessage('Błąd podczas zapisywania danych');
                            setVisible(true);
                        });
                } else {
                    setMessage('Nieprawidłowy login lub hasło');
                    setVisible(true);
                }
            })
            .catch(function (error) {
                console.error('Błąd podczas pobierania użytkowników:', error);
                setMessage('Błąd podczas logowania');
                setVisible(true);
            })
            .finally(function () {

            });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Svg height="90" width="100%" viewBox="0 0 500 120" style={{ marginBottom: 70 }}>
                <Defs>
                    <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#D726B9" />
                        <Stop offset="50%" stopColor="#FF6070" />
                        <Stop offset="100%" stopColor="#FF9B04" />
                    </SvgLinearGradient>
                </Defs>
                <SvgText
                    fill="url(#gradient)"
                    fontSize="142"
                    fontWeight="960"
                    fontStyle="italic"
                    textAnchor="middle"
                    x="50%"
                    y="50%"
                    alignmentBaseline="middle"
                >
                    FitApp
                </SvgText>
            </Svg>

            <TextInput
                style={styles.input}
                placeholder="Login"
                value={login}
                onChangeText={setLogin}
            />

            <TextInput
                style={styles.input}
                placeholder="Hasło"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={autoLogin ? 'checked' : 'unchecked'}
                    onPress={() => setAutoLogin(!autoLogin)}
                />
                <Text style={styles.checkboxText}>Włącz autologowanie</Text>
            </View>

            <Text style={styles.description}>
                <Text>Pierwszy raz? </Text>
                <Text
                    style={styles.blueText}
                    onPress={() => navigation.navigate('Rejestracja')}
                >
                    Zarejestruj się
                </Text>
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Zaloguj się</Text>
            </TouchableOpacity>

            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={3000}
            >
                {message}
            </Snackbar>
        </View>
    );
};

export default LoginScreen;
