import { View, FlatList } from 'react-native';
import styles from './StyleSheet.js';
import { useNotifications } from "../../context/NotificationContext";
import { ListItem, Icon } from 'react-native-elements';

const PowiadomieniaScreen = () => {
    const { notifications, deleteNotification } = useNotifications();

    const handleDeleteNotification = (notificationId) => {
        deleteNotification(notificationId);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id?.toString() || ''}
                renderItem={({ item }) => (
                    <ListItem containerStyle={styles.notificationItem}>
                        <Icon
                            name="info"
                            color="#0095FF"
                        />
                        <ListItem.Content style={styles.notificationContent}>
                            <ListItem.Title style={styles.title}> {item.title || 'Brak tytułu'} </ListItem.Title>
                            <ListItem.Subtitle style={styles.message}> {item.message || 'Brak wiadomości'} </ListItem.Subtitle>
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
        </View>
    );
};

export default PowiadomieniaScreen;
