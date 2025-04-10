import React from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import styles from './StyleSheet.js';
import Icon from 'react-native-vector-icons/Ionicons';

const TreningScreen = ({ navigation }) => {
    const navigateToOpisTreningu = (workoutName, time, calories) => {
        navigation.navigate('Opis Treningu', { workout: workoutName, time, calories });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity
                    style={styles.workoutItem}
                    onPress={() => navigateToOpisTreningu('Klatka Piersiowa Początkujący', '15 MIN', '180 KCAL')}>
                    <Image source={require('../../../assets/TrZdj/Tr1/tr1.png')} style={styles.image} />
                    <Text style={styles.title}>KLATKA PIERSIOWA</Text>
                    <Text style={styles.subtitle}>POCZĄTKUJĄCY</Text>
                    <View style={styles.detailsContainer}>
                        <View style={styles.iconTextContainer}>
                            <Icon name="time-outline" size={20} color="black" />
                            <Text style={styles.time}>15 MIN</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Icon name="flame-outline" size={20} color="black" />
                            <Text style={styles.calories}>180 KCAL</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.workoutItem}
                    onPress={() => navigateToOpisTreningu('Plecy Początkujący', '15 MIN', '90 KCAL')}>
                    <Image source={require('../../../assets/TrZdj/Tr2/tr2.png')} style={styles.image} />
                    <Text style={styles.title}>PLECY</Text>
                    <Text style={styles.subtitle}>POCZĄTKUJĄCY</Text>
                    <View style={styles.detailsContainer}>
                        <View style={styles.iconTextContainer}>
                            <Icon name="time-outline" size={20} color="black" />
                            <Text style={styles.time}>15 MIN</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Icon name="flame-outline" size={20} color="black" />
                            <Text style={styles.calories}>90 KCAL</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.workoutItem}
                    onPress={() => navigateToOpisTreningu('Nogi Zaawansowany', '25 MIN', '150 KCAL')}>
                    <Image source={require('../../../assets/TrZdj/Tr3/tr3.png')} style={styles.image} />
                    <Text style={styles.title}>NOGI</Text>
                    <Text style={styles.subtitle}>ZAAWANSOWANY</Text>
                    <View style={styles.detailsContainer}>
                        <View style={styles.iconTextContainer}>
                            <Icon name="time-outline" size={20} color="black" />
                            <Text style={styles.time}>25 MIN</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Icon name="flame-outline" size={20} color="black" />
                            <Text style={styles.calories}>150 KCAL</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.workoutItem}
                    onPress={() => navigateToOpisTreningu('Brzuch Zaawansowany', '20 MIN', '85 KCAL')}>
                    <Image source={require('../../../assets/TrZdj/Tr4/tr4.png')} style={styles.image} />
                    <Text style={styles.title}>BRZUCH</Text>
                    <Text style={styles.subtitle}>ZAAWANSOWANY</Text>
                    <View style={styles.detailsContainer}>
                        <View style={styles.iconTextContainer}>
                            <Icon name="time-outline" size={20} color="black" />
                            <Text style={styles.time}>20 MIN</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Icon name="flame-outline" size={20} color="black" />
                            <Text style={styles.calories}>85 KCAL</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default TreningScreen;
