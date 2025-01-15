import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIFICATION_STORAGE_KEY = '@notification';
const NotificationsContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState("");
    

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Błąd ładowania powiadomień:', error);
    }
  };


  const saveNotifications = async (updatedNotifications) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Błąd zapisywania powiadomień:', error);
    }
  };


  const addNotification = (newNotification) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications, newNotification];
      saveNotifications(updatedNotifications);
      return updatedNotifications;
    });
  };


  const deleteNotification = (notificationId) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter((notification) => notification.id !== notificationId);
      saveNotifications(updatedNotifications);
      return updatedNotifications;
    });
  };

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "4f9e05d8-748c-4e62-bca4-696d021a91ad",
        })
      ).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const sendNotification = async (newNotification) =>{

    const message = {
      to: expoPushToken,
      title: newNotification.title,
      body: newNotification.message,
    }

    await fetch("https://exp.host/--/api/v2/push/send",{
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });


  }

  useEffect(() => {
    loadNotifications();
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    }).catch((err) => console.log(err));
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, deleteNotification, sendNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};


export const useNotifications = () => {
  return useContext(NotificationsContext);
};