import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Snackbar, Checkbox } from 'react-native-paper';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import styles from './StyleSheet.js';
import { UserContext } from '../../context/UserContext';
import { checkStoredData, handleLogin } from '../../api/auth';

const LoginScreen = ({ navigation }) => {
    const { setUser } = useContext(UserContext);
    const [ login, setLogin ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ autoLogin, setAutoLogin ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        checkStoredData(setUser, navigation, setLoading);
    }, []);

    const handleLoginPress = () => {
        handleLogin(login, password, setUser, setMessage, setVisible, navigation, autoLogin);
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
                onPress={handleLoginPress}
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