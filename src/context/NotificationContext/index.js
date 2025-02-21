import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';

const NOTIFICATION_STORAGE_KEY = '@notification';
const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [ notifications, setNotifications ] = useState([]);
  const [ notificationCount, setNotificationCount ] = useState();

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

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  return (
      <NotificationsContext.Provider value={{ notifications, notificationCount, addNotification, deleteNotification }}>
        {children}
      </NotificationsContext.Provider>
  );
};


export const useNotifications = () => {
  return useContext(NotificationsContext);
};