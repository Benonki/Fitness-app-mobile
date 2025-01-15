import { View, FlatList, StyleSheet,Text } from 'react-native';
import styles from './StyleSheet.js';
import { useNotifications } from "../../context/NotificationContext";
import { ListItem, Icon, FAB } from 'react-native-elements';

const PowiadomieniaScreen = () => {
    const { notifications, deleteNotification, addNotification } = useNotifications();

    const handleDeleteNotification = (notificationId) => {
        deleteNotification(notificationId);
    };

    const handleAddNotification = () =>{
        var newNotification = {
            id: new Date().getTime(),
            title: "Nowe powadomienie",
            message: "Informacja powiadomienia"
        }
        addNotification(newNotification);
    }

    return(
        <View style={styles.container}>
            <FlatList
                data = {notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) =>(
                    <ListItem style={styles.notificationItem}>
                        <Icon 
                            name='info'
                            color='#0095FF'
                        />
                        <ListItem.Content style={styles.notificationContent}>
                            <ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
                            <ListItem.Subtitle style={styles.message}>{item.message}</ListItem.Subtitle>
                        </ListItem.Content>
                        <Icon
                            name='close'
                            color='#2C2C2C'
                            onPress={()=>handleDeleteNotification(item.id)}
                            containerStyle={styles.deleteIcon}
                        />
                    </ListItem>
                )}
            />
            <FAB 
                title='+'
                placement='righ'
                color='#0096FF'
                 onPress={handleAddNotification}
                 style={{
                     position: 'absolute',
                     bottom: 0,
                     right: 10
                 }}
            />
        </View>
    );
};

export default PowiadomieniaScreen;
