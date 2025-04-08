import React, { useContext, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image, Alert } from "react-native";
import styles from './StyleSheet.js';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import * as SecureStore from "expo-secure-store";
import { useNotifications } from "../../context/NotificationContext";
import { UserContext } from "../../context/UserContext";
import { resetDaily } from '../../api/accounts';
import { setNotificationFlag } from '../../api/notifications';

const EkranGlownyScreen = ({ navigation }) => {

    const { notifications, loadUserNotifications, addUserNotification } = useNotifications();
    const { user, setUser } = useContext(UserContext);
    const [userNotificationCount, setUserNotificationCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            loadUserNotifications(user.id);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id && notifications[user.id]) {
            setUserNotificationCount(notifications[user.id].length);
        }
    }, [notifications, user?.id]);

    useEffect(() => {
        const checkDateAndReset = async () => {
            if (!user) return;

            try {
                const today = new Date().toISOString().split('T')[0];
                const userSyncDate = new Date(user.lastSyncDate).toISOString().split('T')[0];
                if (userSyncDate !== today) {
                    await resetDaily(user.id);
                }
            } catch (error) {
                console.error('Błąd podczas resetowania danych:', error);
            }
        };

        checkDateAndReset();
    }, [user]);

    useEffect(() => {
        if(!user) return;
        const sendBirthdayNotification = async () => {
            const today = new Date().toLocaleDateString().split('.', 2);
            const userBirthday = user.dataUr.split('.', 2);

            if (today[0] === userBirthday[0] && today[1] === userBirthday[1] && !user.notificationFlags?.birthdaySent) {
                try {
                    const newNotification = {
                        id: new Date().getTime(),
                        title: "Wszystkiego Najlepszego🎉",
                        message: `Wszystkiego najlepszego ${user.imie}🎂`
                    };
                    const updatedUser = await setNotificationFlag(user.id, 'birthdaySent', true);
                    setUser(updatedUser);
                    await addUserNotification(user.id, newNotification);
                } catch (error) {
                    console.error('Błąd podczas wysyłania powiadomienia urodzinowego:', error);
                }
            }
        };
        sendBirthdayNotification();
    }, [user]);

    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userLogin');
            await SecureStore.deleteItemAsync('AutoLoginMode');
            setUser(null);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Błąd', 'Nie udało się wylogować użytkownika.');
            console.error('Błąd podczas wylogowywania:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Svg height="120" width="100%" viewBox="0 0 500 120" style={{ marginBottom: 5 }}>
                <Defs>
                    <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#D726B9" />
                        <Stop offset="50%" stopColor="#FF6070" />
                        <Stop offset="100%" stopColor="#FF9B04" />
                    </SvgLinearGradient>
                </Defs>
                <SvgText
                    fill="url(#gradient)"
                    fontSize="102"
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

            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Cześć {user?.imie}! 👋😀</Text>
            </View>

            {/* Pierwszy rząd */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Wybór Treningu")}>
                    <Image source={require('../../../assets/EkrGlZdj/Trening.png')} style={styles.image} />
                    <Text style={styles.label}>Wybór Treningu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Wyszukiwarka Produktów")}>
                    <Image source={require('../../../assets/EkrGlZdj/Wyszukiwarka.png')} style={styles.image} />
                    <Text style={styles.label}>Wyszukiwarka produktów</Text>
                </TouchableOpacity>
            </View>

            {/* Drugi rząd */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Powiadomienia")}>
                    <Image source={require('../../../assets/EkrGlZdj/Powiadomienia.png')} style={styles.image} />
                    {userNotificationCount > 0 && (
                        <View style={styles.cornerBadge}><Text style={styles.badgeText}>{userNotificationCount}</Text></View>
                    )}
                    <Text style={styles.label}>Powiadomienia</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Śledzenie Diety")}>
                    <Image source={require('../../../assets/EkrGlZdj/Dieta.png')} style={styles.image} />
                    <Text style={styles.label}>Śledzenie Diety</Text>
                </TouchableOpacity>
            </View>

            {/* Trzeci rząd */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profil")}>
                    <Image source={require('../../../assets/EkrGlZdj/Profil.png')} style={styles.image} />
                    <Text style={styles.label}>Profil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Image source={require('../../../assets/EkrGlZdj/Wylogowanie.png')} style={styles.image} />
                    <Text style={styles.label}>Wyloguj się</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default EkranGlownyScreen;