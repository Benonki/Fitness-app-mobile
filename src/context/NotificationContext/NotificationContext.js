import React, { createContext, useState, useContext } from 'react';
import { loadNotifications, addNotification, deleteNotification } from '../../api/notifications';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({});

  const loadUserNotifications = async (userId) => {
    try {
      const userNotifications = await loadNotifications(userId);
      setNotifications((prev) => ({
        ...prev,
        [userId]: userNotifications,
      }));
    } catch (error) {
      console.error('Błąd ładowania powiadomień:', error);
    }
  };

  const addUserNotification = async (userId, newNotification) => {
    try {
      const updatedNotifications = await addNotification(userId, newNotification);
      setNotifications((prev) => ({
        ...prev,
        [userId]: updatedNotifications,
      }));
    } catch (error) {
      console.error('Błąd dodawania powiadomienia:', error);
    }
  };

  const deleteUserNotification = async (userId, notificationId) => {
    try {
      const updatedNotifications = await deleteNotification(userId, notificationId);
      setNotifications((prev) => ({
        ...prev,
        [userId]: updatedNotifications,
      }));
    } catch (error) {
      console.error('Błąd usuwania powiadomienia:', error);
    }
  };

  return (
      <NotificationsContext.Provider value={{ notifications, loadUserNotifications, addUserNotification, deleteUserNotification }}>
        {children}
      </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};