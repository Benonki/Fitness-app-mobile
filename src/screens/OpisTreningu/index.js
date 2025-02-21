import React from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import styles from './StyleSheet.js';
import Icon from 'react-native-vector-icons/Ionicons';
import workoutData from './workoutData';

const OpisTreninguScreen = ({ route }) => {
    const { workout, time, calories } = route.params;
    const workoutDetails = workoutData[workout];

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={workoutDetails.image} style={styles.headerImage} />
                <Text style={styles.title}>{workout.toUpperCase()}</Text>
            </View>
            <View style={styles.timeContainer}>
                <Icon name="time-outline" size={30} color="white" />
                <Text style={styles.timeText}>{time}</Text>
            </View>
            <View style={styles.caloriesContainer}>
                <Icon name="flame-outline" size={30} color="white" />
                <Text style={styles.caloriesText}>{calories}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Ilość obwodów: {workoutDetails.details.circles}
                </Text>
                <Text style={styles.infoText}>
                    Ilość ćwiczeń: {workoutDetails.details.totalExercises}
                </Text>
            </View>
            <FlatList
                data={workoutDetails.exercises}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.exerciseItem}>
                        <Image source={item.image} style={styles.exerciseImage} resizeMode="contain" />
                        <View style={styles.exerciseTextContainer}>
                            <Text style={styles.exerciseName}>{item.name}</Text>
                            <Text style={styles.exerciseReps}>
                                Liczba powtórzeń: {item.repetitions}
                            </Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default OpisTreninguScreen;
