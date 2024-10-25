import React, { useState } from 'react';
import { Text, View, Switch } from 'react-native';

const UstawieniaScreen = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode((previousMode) => !previousMode);
    };

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? '#222' : '#fff',
        }}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000', marginBottom: 20 }}>
                UstawieniaScreen
            </Text>
            <Text style={{ color: isDarkMode ? '#fff' : '#000', marginBottom: 10 }}>
                Dark Mode: {isDarkMode ? "On" : "Off"}
            </Text>
            <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
            />
        </View>
    );
}

export default UstawieniaScreen;
