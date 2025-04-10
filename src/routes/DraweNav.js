import { createDrawerNavigator } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import EkranGlownyScreen from "../screens/EkranGlowny/EkranGlowny";
import ProfilScreen from "../screens/Profil/Profil";
import TreningScreen from "../screens/Trening/Trening";
import DietaScreen from "../screens/Dieta/Dieta";
import WyszukiwarkaScreen from "../screens/Wyszukiwarka/Wyszukiwarka";
import PowiadomieniaScreen from "../screens/Powiadomienia/Powiadomienia";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNotifications } from '../context/NotificationContext';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../context/UserContext";

const Drawer = createDrawerNavigator();

const GradientHeader = () => (
    <LinearGradient
        colors={['#D726B9', '#FF6070', '#FF9B04']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#fff'  }}
    />
);

const DrawerNav = () => {

    const { notifications } = useNotifications();
    const [userNotificationCount, setUserNotificationCount] = useState(0);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user?.id && notifications[user.id]) {
            setUserNotificationCount(notifications[user.id].length);
        }
    }, [notifications, user?.id, user?.notifications]);
    
    return (
        <Drawer.Navigator
            screenOptions={({navigation}) => ({
                headerBackground: () => <GradientHeader />,
                headerStyle: { backgroundColor: 'transparent', elevation: 0, },
                drawerStyle: { backgroundColor: '#e8eaed', width: 330, },
                drawerLabelStyle: { fontSize: 16, fontWeight: '600', color: '#333',},
                drawerInactiveTintColor: '#A0A0A0',
                drawerActiveTintColor: '#11D9EF',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.drawerIcon}>
                        <Ionicons name="menu" size={24} color="black" />
                        {userNotificationCount > 0 && (
                            <View style={styles.cornerBadge}>
                                <Text style={styles.badgeText}>{userNotificationCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ),
            })}>
            <Drawer.Screen name="Ekran Główny" component={EkranGlownyScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
            <Drawer.Screen name="Wybór Treningu" component={TreningScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="fitness-center" size={size} color={color} /> }} />
            <Drawer.Screen name="Śledzenie Diety" component={DietaScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="restaurant" size={size} color={color} /> }} />
            <Drawer.Screen name="Wyszukiwarka Produktów" component={WyszukiwarkaScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="search" size={size} color={color} /> }} />
            <Drawer.Screen
                name="Powiadomienia" 
                component={PowiadomieniaScreen}
                options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="notifications" size={size} color={color} />,
                            drawerLabel: () => (
                                <View style = {styles.drawerLabelContainer}>
                                    <Text style={styles.drawerLabelText}>Powiadomienia</Text>
                                    {userNotificationCount > 0 && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{userNotificationCount}</Text>
                                        </View>
                                    )}
                                </View>
                            ),}} />
            <Drawer.Screen name="Profil" component={ProfilScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} /> }} />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerIcon: {
        marginLeft: 15,
      },
      cornerBadge: {
        position: "absolute",
        right: -10,
        top: -5,
        backgroundColor: "red",
        borderRadius: 10,
        height: 20,
        minWidth: 20,
        justifyContent: "center",
        alignItems: "center",
      },
      drawerLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      drawerLabelText: {
        fontSize: 16, 
        fontWeight: '600', 
        olor: '#333',
        marginRight: 10,
      },
      badge: {
        backgroundColor: "red",
        borderRadius: 10,
        height: 20,
        minWidth: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
      },
      badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
      },
});

export default DrawerNav;