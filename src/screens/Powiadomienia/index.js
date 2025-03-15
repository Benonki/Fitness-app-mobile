import { View, FlatList, Text } from 'react-native';
import styles from './StyleSheet.js';
import { useNotifications } from "../../context/NotificationContext";
import { UserContext } from "../../context/UserContext";
import { ListItem, Icon } from 'react-native-elements';
import { useContext, useEffect } from "react";

const PowiadomieniaScreen = () => {
    const { notifications, loadUserNotifications, deleteUserNotification } = useNotifications();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user?.id) {
            loadUserNotifications(user.id);
        }
    }, [user?.id]);

    const userNotifications = notifications[user?.id] || [];

    const handleDeleteNotification = (notificationId) => {
        deleteUserNotification(user.id, notificationId);
    };

    return (
        <View style={styles.container}>
            {userNotifications.length === 0 ? (
                <Text style={styles.noNotifications}>Brak powiadomień</Text>
            ) : (
                <FlatList
                    data={userNotifications}
                    keyExtractor={(item) => item.id?.toString() || ''}
                    renderItem={({ item }) => (
                        <ListItem containerStyle={styles.notificationItem}>
                            <Icon name="info" color="#0095FF" />
                            <ListItem.Content style={styles.notificationContent}>
                                <ListItem.Title style={styles.title}>
                                    {item.title || 'Brak tytułu'}
                                </ListItem.Title>
                                <ListItem.Subtitle style={styles.message}>
                                    {item.message || 'Brak wiadomości'}
                                </ListItem.Subtitle>
                                <View style={styles.dateContainer}>
                                    <Icon name="schedule" color="#888" size={14} />
                                    <Text style={styles.notificationDate}>
                                        {item.date ? new Date(item.date).toLocaleString() : 'Brak daty'}
                                    </Text>
                                </View>
                            </ListItem.Content>
                            <Icon
                                name="close"
                                color="#2C2C2C"
                                onPress={() => handleDeleteNotification(item.id)}
                                containerStyle={styles.deleteIcon}
                            />
                        </ListItem>
                    )}
                />
            )}
        </View>
    );
};

export default PowiadomieniaScreen;
