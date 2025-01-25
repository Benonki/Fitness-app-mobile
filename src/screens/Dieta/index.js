import React, { useContext, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity  } from 'react-native';
import CircularProgress from "react-native-circular-progress-indicator";
import { StepContext } from '../../context/StepContext';
import { ProductContext } from '../../context/ProductContext';
import styles from './StyleSheet.js';
import { useNotifications } from '../../context/NotificationContext';
import { UserContext } from '../../context/UserContext';

const DietaScreen = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const { stepCount, pedometerAvailability } = useContext(StepContext);
    const [maxSteps, setMaxSteps] = useState(0);
    const { getTotalNutrients } = useContext(ProductContext);
    //const [ maxCalories, setMaxCalories ] = useState(0);
    const [stepGoalReached, setStepGoalReached] = useState(false);
    const [caloriesGoalReached, setCaloriesGoalReached] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const {addNotification, sendNotification} = useNotifications();

    useEffect(() => {
        if (user) {
            setMaxSteps(user.kroki);
            //setMaxCalories(user.kalorie);
            setIsDataLoaded(true);
        }
    }, [user]);

    let Dist = (stepCount / 1300).toFixed(4); // Dystans w kilometrach
    let cal = (Dist * 60).toFixed(4); // Spalone kalorie
    const { calories: consumedCalories } = getTotalNutrients(); // Pobranie kalorii spożytych z kontekstu
    
    // Sprawdzenie czy osiągnięto cel kroków
    useEffect(() => {

        if(!isDataLoaded) {
            return;
        }
        if (stepCount >= 10 && !stepGoalReached) { // zmienić na maxSteps
            var newNotification = {
                id: new Date().getTime(),
                title: "Gratulacje! :D",
                message: "Osiągnąłeś swój cel kroków!!!"
            }

            addNotification(newNotification);
            //sendNotification(newNotification);
            setStepGoalReached(true);
        }

        if(consumedCalories >= 2000  && !caloriesGoalReached){ // zmienić na maxCalories
            var newNotification = {
                id: new Date().getTime(),
                title: "Gratulacje! :D",
                message: "Osiągnąłeś swój cel kalorii!!!"
            }

            addNotification(newNotification);
            //sendNotification(newNotification);
            setCaloriesGoalReached(true);
        }
        
    }, [stepCount, stepGoalReached, caloriesGoalReached, addNotification]);

    return (
        <View style={styles.container}>
            {pedometerAvailability === "Not available" && (
                <Text>
                    Is Pedometer available: Not available
                </Text>
            )}

            <View style={styles.CircularProgressArea}>
                <View style={styles.BorderOut}>
                    <CircularProgress
                        value={stepCount}
                        maxValue={maxSteps || 6500}
                        radius={190}
                        textColor={'#000'}
                        activeStrokeColor={'#11D9EF'}
                        inActiveStrokeColor={'#979292'}
                        inActiveStrokeOpacity={0.5}
                        inActiveStrokeWidth={40}
                        activeStrokeWidth={40}
                        title={`/${maxSteps || 6500}`}
                        titleColor={'#000'}
                        titleStyle={{ fontWeight: 'bold', fontSize: 45 }}
                    />
                    <View style={styles.BorderIns} />
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.textDesign, { paddingLeft: 12 }]}>Dystans Przebyty : {Dist} km</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={[styles.textDesign, { paddingLeft: 22 }]}>Spalone Kalorie : {cal}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={[styles.textDesign, { paddingLeft: 22 }]}>Spożyte Kalorie : {consumedCalories}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate("Dodane Produkty")}
            >
                <Text style={styles.buttonText}>Zobacz Dodane Produkty</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DietaScreen;
