import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import LoginScreen from "../screens/Login/Login";
import RejestracjaScreen from "../screens/Rejestracja/Rejestracja";
import OpisTreninguScreen from "../screens/OpisTreningu/OpisTreningu";
import InformacjaScreen from "../screens/Informacje/Informacje";
import DrawerNav from "./DraweNav";
import WyszukiwarkaScreen from '../screens/Wyszukiwarka/Wyszukiwarka';
import DodaneProduktyScreen from '../screens/DodaneProdukty/DodaneProdukty';

const Stack = createNativeStackNavigator();

const GradientHeader = () => (
    <LinearGradient
        colors={['#D726B9', '#FF6070', '#FF9B04']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
    />
);
const StackNav = () => {
    return (
        <Stack.Navigator screenOptions={{headerStyle: { backgroundColor: 'transparent' }}}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerBackground: () => <GradientHeader/>}}/>
            <Stack.Screen name="Rejestracja" component={RejestracjaScreen} options={{ headerBackground: () => <GradientHeader/>, }}/>
            <Stack.Screen name="Opis Treningu" component={OpisTreninguScreen} options={{ headerBackground: () => <GradientHeader/>}}/>
            <Stack.Screen name="Informacje o Produkcie" component={InformacjaScreen} options={{ headerBackground: () => <GradientHeader/>}}/>
            <Stack.Screen name="DrawerNav" component={DrawerNav} options={{ headerShown: false }}/>
            <Stack.Screen name="Wyszukiwarka" component={WyszukiwarkaScreen} options={{ headerShown: false}}></Stack.Screen>
            <Stack.Screen name="Dodane Produkty" component={DodaneProduktyScreen} options={{ headerBackground: () => <GradientHeader/>}}></Stack.Screen>
        </Stack.Navigator>
    );
};

export default StackNav;