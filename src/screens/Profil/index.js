import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import styles from './StyleSheet.js';
import config from '../../../JsonIpConfig.js';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ProfilScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [bmi, setBmi] = useState(0);
    const [gender, setGender] = useState('');
    const [goal, setGoal] = useState('');
    const [image, setImage] = useState(null);
    const [visibilityDatePicker, sertVisibilityDatePicker] = useState(false);

    const showDatePicker = () => {
        sertVisibilityDatePicker(true);
      };
    
    const hideDatePicker = () => {
        sertVisibilityDatePicker(false);
      };
    
    const handleDateConfirm = (date) => {
        const formattedDate = date.toLocaleDateString('pl-PL');
        handleChange('dataUr', formattedDate);
        hideDatePicker();
    };
    

    const pickImage = async() =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        });

        console.log(result);

        if(!result.canceled){
            const imageUri = result.assets[0].uri
            setImage(imageUri);
            handleChange('imageUri',imageUri);
        }
    };

    const calculateBmi = (weight, height) => {
        const bmiValue = (weight / ((height / 100) ** 2)).toFixed(2);
        setBmi(bmiValue);
    };

    const loadUserData = async () => {
        try {
            const userLogin = await SecureStore.getItemAsync('userLogin');
            if (userLogin) {
                const response = await axios.get(`${config.apiBaseUrl}/users?login=${userLogin}`);
                const user = response.data[0];

                if (user) {
                    setUserData(user);
                    setGender(user.plec);
                    setImage(user.imageUri);
                    setGoal(user.cel);
                    calculateBmi(user.waga, user.wzrost);
                } else {
                    Alert.alert('Błąd', 'Nie znaleziono użytkownika.');
                    navigation.navigate('Login');
                }
            } else {
                Alert.alert('Błąd', 'Brak zalogowanego użytkownika.');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Błąd podczas ładowania danych użytkownika:', error);
            Alert.alert('Błąd', 'Nie udało się załadować danych użytkownika.');
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleChange = (key, value) => {
        if (userData) {
            const updatedData = { ...userData, [key]: value };
            setUserData(updatedData);

            if (key === 'waga' || key === 'wzrost') {
                calculateBmi(
                    key === 'waga' ? value : userData.waga,
                    key === 'wzrost' ? value : userData.wzrost
                );
            }

            SecureStore.setItemAsync('userData', JSON.stringify(updatedData));
        }
    };

    const updateUserData = async () => {
        const userLogin = await SecureStore.getItemAsync('userLogin');
        if (!userLogin) {
            Alert.alert('Błąd', 'Brak zalogowanego użytkownika.');
            return;
        }

        try {
            const response = await axios.get(`${config.apiBaseUrl}/users?login=${userLogin}`);

            if (response.data.length === 0) {
                Alert.alert('Błąd', 'Nie znaleziono użytkownika o takim loginie.');
                return;
            }

            const userId = response.data[0].id;
            await axios.put(`${config.apiBaseUrl}/users/${userId}`, userData);

            Alert.alert('Sukces', 'Dane zostały zaktualizowane');
        } catch (error) {
            console.error('Błąd podczas aktualizacji danych:', error);
            Alert.alert('Błąd', 'Nie udało się zaktualizować danych');
        }
    };

    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userLogin');
            await SecureStore.deleteItemAsync('userPassword');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Błąd', 'Nie udało się wylogować użytkownika.');
            console.error('Błąd podczas wylogowywania:', error);
        }
    };

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Ładowanie danych...</Text>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Wyloguj się</Text>
                </TouchableOpacity>
            </View>

        );
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <ScrollView contentContainerStyle>
                <Text style={styles.header}>Cel związany z aktywnością</Text>

                <View style={styles.formGroup}>
                    <Text>Kroki:</Text>
                    <TextInput
                        style={styles.inputCele}
                        keyboardType="numeric"
                        value={String(userData.kroki)}
                        onChangeText={(text) => handleChange('kroki', parseInt(text) || 0)}
                    />
                </View>

                <View>
                    <TouchableOpacity onPress={pickImage} style={styles.touchable}>
                        {image ?(<Image
                                    source={{uri:image}}
                                    style={styles.image}
                                    resizeMode="cover"
                                    />) 
                                :(<Image
                                    source={require('../../../assets/personImage.png')}
                                    style={styles.image}
                                    resizeMode="cover"
                                    />)}
                    </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                    <Text>Cel treningowy:</Text>
                    <View style={styles.pickerWrapperCele}>
                        <Picker
                            selectedValue={goal}
                            style={styles.pickerInput}
                            onValueChange={(itemValue) => {
                                setGoal(itemValue);
                                handleChange('cel', itemValue);
                            }}
                        >
                            <Picker.Item label="Tycie" value="Tycie" />
                            <Picker.Item label="Utrata wagi" value="Utrata wagi" />
                            <Picker.Item label="Keto" value="Keto" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text>Liczba treningów w tygodniu:</Text>
                    <TextInput
                        style={styles.inputCele}
                        keyboardType="numeric"
                        value={String(userData.iloscTr)}
                        onChangeText={(text) => handleChange('iloscTr', parseInt(text) || 0)}
                    />
                </View>

                <Text style={styles.header}>Informacje o Tobie</Text>

                <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                        <Text>Imię:</Text>
                        <TextInput
                            style={styles.inputInfo}
                            value={userData.imie}
                            onChangeText={(text) => handleChange('imie', text)}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text>Nazwisko:</Text>
                        <TextInput
                            style={styles.inputInfo}
                            value={userData.nazwisko}
                            onChangeText={(text) => handleChange('nazwisko', text)}
                        />
                    </View>
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                        <Text>Waga (kg):</Text>
                        <TextInput
                            style={styles.inputInfo}
                            keyboardType="numeric"
                            value={String(userData.waga)}
                            onChangeText={(text) => handleChange('waga', parseFloat(text) || 0)}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text>Wzrost (cm):</Text>
                        <TextInput
                            style={styles.inputInfo}
                            keyboardType="numeric"
                            value={String(userData.wzrost)}
                            onChangeText={(text) => handleChange('wzrost', parseFloat(text) || 0)}
                        />
                    </View>
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                        <Text>Płeć:</Text>
                        <View style={styles.pickerWrapperInfo}>
                            <Picker
                                selectedValue={gender}
                                style={styles.pickerInput}
                                onValueChange={(itemValue) => {
                                    setGender(itemValue);
                                    handleChange('plec', itemValue);
                                }}
                            >
                                <Picker.Item label="Mężczyzna" value="Mężczyzna" />
                                <Picker.Item label="Kobieta" value="Kobieta" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                    <Text>Data urodzenia:</Text>
                    <TouchableOpacity onPress={showDatePicker} style={styles.inputInfo}>
                        <Text>
                            {userData.dataUr ? userData.dataUr : 'Wybierz datę'}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={visibilityDatePicker}
                        mode="date"
                        onConfirm={(date) => {
                            handleDateConfirm(date);
                        }}
                        onCancel={hideDatePicker}
                    />
                </View>

                </View>

                <View style={styles.bmiContainer}>
                    <Text>Twój wskaźnik masy ciała (BMI) wynosi:</Text>
                    <Text style={styles.bmiValue}>{bmi}</Text>
                    <Text>
                        Twoje BMI wskazuje: {bmi < 18.5 ? 'Niedowaga' : bmi <= 24.9 ? 'Waga prawidłowa' : 'Nadwaga'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={updateUserData}>
                    <Text style={styles.buttonText}>Zapisz zmiany</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Wyloguj się</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ProfilScreen;
