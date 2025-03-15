import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import config from '../../../JsonIpConfig.js';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({});

  const loadNotifications = async (userId) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/users/${userId}`);
      setNotifications((prev) => ({
        ...prev,
        [userId]: response.data.notifications || [],
      }));
    } catch (error) {
      console.error('Błąd ładowania powiadomień:', error);
    }
  };

  const addNotification = async (userId, newNotification) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/users/${userId}`);
      const user = response.data;
      const updatedNotifications = [...(user.notifications || []), { ...newNotification, date: new Date().toISOString() }];

      await axios.patch(`${config.apiBaseUrl}/users/${userId}`, { notifications: updatedNotifications });

      setNotifications((prev) => ({
        ...prev,
        [userId]: updatedNotifications,
      }));
    } catch (error) {
      console.error('Błąd dodawania powiadomienia:', error);
    }
  };

  const deleteNotification = async (userId, notificationId) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/users/${userId}`);
      const user = response.data;
      const updatedNotifications = user.notifications.filter((notif) => notif.id !== notificationId);

      await axios.patch(`${config.apiBaseUrl}/users/${userId}`, { notifications: updatedNotifications });

      setNotifications((prev) => ({
        ...prev,
        [userId]: updatedNotifications,
      }));
    } catch (error) {
      console.error('Błąd usuwania powiadomienia:', error);
    }
  };

  return (
      <NotificationsContext.Provider value={{ notifications, loadNotifications, addNotification, deleteNotification }}>
        {children}
      </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};