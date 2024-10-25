import {Text, View, Button} from "react-native";

const LoginScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Login screen</Text>
            <Button
                onPress={() => navigation.navigate('DrawerNav')}
                title="Zaloguj się"
            />
        </View>
    );
}

export default LoginScreen;
