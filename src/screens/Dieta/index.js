import React, { useContext, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity  } from 'react-native';
import CircularProgress from "react-native-circular-progress-indicator";
import { StepContext } from '../../context/StepContext';
import { ProductContext } from '../../context/ProductContext';
import styles from './StyleSheet.js';
import { useNotifications } from '../../context/NotificationContext';
import { UserContext } from '../../context/UserContext';
import { setNotificationFlag } from '../../api/notifications';

const DietaScreen = ({ navigation }) => {
    const { user, setUser} = useContext(UserContext);
    const { stepCount, pedometerAvailability } = useContext(StepContext);
    const [ maxSteps, setMaxSteps ] = useState(0);
    const { getTotalNutrients } = useContext(ProductContext);
    const [ maxCalories, setMaxCalories ] = useState(0);
    const [ consumedCalories, setConsumedCalories ] = useState(0);
    const [ isDataLoaded, setIsDataLoaded ] = useState(false);
    const { addUserNotification } = useNotifications();
    const { products } = useContext(ProductContext);

    useEffect(() => {
        setConsumedCalories(getTotalNutrients().calories);
    }, [products]);

    useEffect(() => {
        if (user) {
            setMaxSteps(user.kroki);
            calculateCalories();
            setIsDataLoaded(true);
        }
    }, [user]);

    const calculateCalories = () => {
        var typeOfDiet = user.cel;
        var numberOfWorkouts = user.iloscTr;

        const age = new Date().getFullYear() - parseInt(user.dataUr.slice(-4));
        var calories = 0;

        if (user.plec === "Mężczyzna")
            calories = 66.5 + (13.75 * user.waga) + (5.003 * user.wzrost) - (6.775 * age);
        else
            calories = 665.1 + (9.563 * user.waga) + (1.85 * user.wzrost) - (4.676 * age);

        switch (numberOfWorkouts) {
            case 0:
                break;
            case 1:
            case 2:
            case 3:
                calories = calories * 1.6;
                break;
            case 4:
            case 5:
                calories = calories * 1.8;
                break;
            default:
                calories = calories * 2.0;
                break;
        }

        switch (typeOfDiet) {
            case "Utrata wagi":
                calories = calories - 300;
                setMaxCalories(parseInt(calories));
                break;
            case "Przybieranie na wadze":
                calories = calories + 300;
                setMaxCalories(parseInt(calories));
                break;

            case "Utrzymanie wagi":
                setMaxCalories(parseInt(calories));
                break;
            default:
                setMaxCalories(2000);
                break;
        }
    };

    let Dist = (stepCount / 1300).toFixed(4); // Dystans w kilometrach
    let cal = (Dist * 60).toFixed(4); // Spalone kalorie

    useEffect(() => {
        const checkGoalsAndSendNotifications = async () => {
            if (!isDataLoaded || !user) return;

            try {
                if (stepCount >= maxSteps && !user.notificationFlags?.stepsGoalSent) {
                    const stepNotification = {
                        id: new Date().getTime(),
                        title: "Gratulacje! 😀",
                        message: "Osiągnąłeś swój cel kroków 👟!!!"
                    };
                    const updatedUser = await setNotificationFlag(user.id, 'stepsGoalSent', true);
                    setUser(updatedUser);
                    await addUserNotification(user.id, stepNotification);
                }

                if (consumedCalories >= maxCalories && !user.notificationFlags?.caloriesGoalSent) {
                    const caloriesNotification = {
                        id: new Date().getTime(),
                        title: "Gratulacje! 😀",
                        message: "Osiągnąłeś swój cel kalorii 🍕!!!"
                    };
                    const updatedUser = await setNotificationFlag(user.id, 'caloriesGoalSent', true);
                    setUser(updatedUser);
                    await addUserNotification(user.id, caloriesNotification);
                }
            } catch (error) {
                console.error('Błąd podczas aktualizacji flag powiadomień:', error);
            }
        };

        checkGoalsAndSendNotifications();
    }, [stepCount, consumedCalories, maxSteps, maxCalories, isDataLoaded, addUserNotification]);


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
                    <Text style={styles.textDesign}>
                        Dystans Przebyty : {Dist} km
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.textDesign}>
                        Spalone Kalorie : {cal}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={[styles.textDesign, { height: 75}]}>
                        Spożyte Kalorie : {"\n"}
                        {consumedCalories} / {maxCalories}
                    </Text>
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
