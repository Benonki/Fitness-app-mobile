import React, { useContext, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity  } from 'react-native';
import CircularProgress from "react-native-circular-progress-indicator";
import { StepContext } from '../../context/StepContext/StepContext';
import { ProductContext } from '../../context/ProductContext/ProductContext';
import styles from './StyleSheet.js';
import { UserContext } from '../../context/UserContext/UserContext';

const DietaScreen = ({ navigation }) => {
    const { user} = useContext(UserContext);
    const { stepCount, pedometerAvailability } = useContext(StepContext);
    const [ maxSteps, setMaxSteps ] = useState(0);
    const [ consumedCalories, setConsumedCalories ] = useState(0);
    const { getTotalNutrients, products, maxCalories } = useContext(ProductContext);

    useEffect(() => {
        setConsumedCalories(getTotalNutrients().calories);
    }, [products]);

    useEffect(() => {
        if (user) {
            setMaxSteps(user.kroki);
        }
    }, [user]);

    let Dist = (stepCount / 1300).toFixed(4); // Dystans w kilometrach
    let cal = (Dist * 60).toFixed(4); // Spalone kalorie

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
