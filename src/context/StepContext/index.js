import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { UserContext } from '../UserContext';
import { loadStepData, saveSteps } from '../../api/steps';

export const StepContext = createContext();

export const StepProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const [pedometerAvailability, setPedometerAvailability] = useState(null);
    const [stepCount, setStepCount] = useState(0);
    const [lastSavedStep, setLastSavedStep] = useState(0);
    const stepOffset = useRef(0);
    const [stepCounter, setStepCounter] = useState(null);

    const requestPedometerPermission = async () => {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    useEffect(() => {
        if (!user) {
            if (stepCounter) {
                stepCounter.remove();
                setStepCounter(null);
            }
            return;
        }

        const startPedometer = async () => {
            const permission = await requestPedometerPermission();
            if (!permission) {
                setPedometerAvailability('Permission not granted');
                return;
            }

            const initialSteps = await loadStepData(user.id);
            stepOffset.current = initialSteps;
            setStepCount(initialSteps);
            setLastSavedStep(initialSteps);

            const newStepCounter = Pedometer.watchStepCount(result => {
                const newStepCount = stepOffset.current + result.steps;
                setStepCount(newStepCount);
                saveSteps(user.id, newStepCount, lastSavedStep).then((updatedSteps) => {
                    setLastSavedStep(updatedSteps);
                });
            });

            setStepCounter(newStepCounter);

            Pedometer.isAvailableAsync().then(
                result => setPedometerAvailability(result ? 'Available' : 'Not available'),
                error => setPedometerAvailability('Error: ' + error)
            );
        };

        startPedometer();

        return () => {
            if (stepCounter) {
                stepCounter.remove();
                setStepCounter(null);
            }
        };
    }, [user]);

    return (
        <StepContext.Provider value={{ stepCount, pedometerAvailability }}>
            {children}
        </StepContext.Provider>
    );
};
