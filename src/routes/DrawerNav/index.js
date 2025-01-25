import { createDrawerNavigator } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import EkranGlownyScreen from "../../screens/EkranGlowny";
import ProfilScreen from "../../screens/Profil";
import TreningScreen from "../../screens/Trening";
import DietaScreen from "../../screens/Dieta";
import WyszukiwarkaScreen from "../../screens/Wyszukiwarka";
import PowiadomieniaScreen from "../../screens/Powiadomienia";
import { MaterialIcons } from '@expo/vector-icons';

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
    return (
        <Drawer.Navigator
            screenOptions={{
                headerBackground: () => <GradientHeader />,
                headerStyle: { backgroundColor: 'transparent', elevation: 0, },
                drawerStyle: { backgroundColor: '#e8eaed', width: 330, },
                drawerLabelStyle: { fontSize: 16, fontWeight: '600', color: '#333',},
                drawerInactiveTintColor: '#A0A0A0',
                drawerActiveTintColor: '#11D9EF',
            }}>
            <Drawer.Screen name="Ekran Główny" component={EkranGlownyScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
            <Drawer.Screen name="Wybór Treningu" component={TreningScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="fitness-center" size={size} color={color} /> }} />
            <Drawer.Screen name="Śledzenie Diety" component={DietaScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="restaurant" size={size} color={color} /> }} />
            <Drawer.Screen name="Wyszukiwarka Produktów" component={WyszukiwarkaScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="search" size={size} color={color} /> }} />
            <Drawer.Screen name="Powiadomienia" component={PowiadomieniaScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="notifications" size={size} color={color} /> }} />
            <Drawer.Screen name="Profil" component={ProfilScreen} options={{ drawerIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} /> }} />
        </Drawer.Navigator>
    );
};

export default DrawerNav;