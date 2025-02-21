import React, { createContext, useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StepContext = createContext();

export const StepProvider = ({ children }) => {
    const [ pedometerAvailability, setPedometerAvailability ] = useState(null);
    const [ stepCount, setStepCount ] = useState(0);
    const [ initialSteps, setInitialSteps ] = useState(0);
    const [ lastDate, setLastDate ] = useState(null);

    async function requestPedometerPermission() {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    }

    const loadStepCount = async () => {
        try {
            const savedStepCount = await AsyncStorage.getItem('stepCount');
            const savedDate = await AsyncStorage.getItem('stepCountDate');

            const today = new Date().toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            if (savedDate && savedDate !== today) {
                setStepCount(0);
                setInitialSteps(0);
                await AsyncStorage.setItem('stepCount', '0');
            } else {
                if (savedStepCount !== null) {
                    setInitialSteps(parseInt(savedStepCount, 10));
                    setStepCount(parseInt(savedStepCount, 10));
                }
            }

            setLastDate(today);
            await AsyncStorage.setItem('stepCountDate', today);
        } catch (error) {
            console.error("Error loading step count:", error);
        }
    };

    const saveStepCount = async (newStepCount) => {
        try {
            if (lastDate) {
                await AsyncStorage.setItem('stepCount', newStepCount.toString());
                await AsyncStorage.setItem('stepCountDate', lastDate);
            }
        } catch (error) {
            console.error("Error saving step count:", error);
        }
    };

    useEffect(() => {
        const startPedometer = async () => {
            const permission = await requestPedometerPermission();
            if (!permission) {
                setPedometerAvailability("Permission not granted");
                return;
            }

            loadStepCount();

            const stepCounter = Pedometer.watchStepCount(result => {
                    setStepCount(initialSteps + result.steps);
                    saveStepCount(initialSteps + result.steps);
            });

            Pedometer.isAvailableAsync().then(
                result => setPedometerAvailability(result ? "Available" : "Not available"),
                error => setPedometerAvailability("Error: " + error)
            );

            return () => {
                stepCounter && stepCounter.remove();
            };
        };

        startPedometer();
    }, [lastDate]);

    return (
        <StepContext.Provider value={{ stepCount, pedometerAvailability }}>
            {children}
        </StepContext.Provider>
    );
};
