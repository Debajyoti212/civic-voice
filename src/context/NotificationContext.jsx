import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFromStorage, setToStorage } from '../utils/storage.js';
import { generateId } from '../utils/helpers.js';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => getFromStorage('cv_notifications', []));

  useEffect(() => {
    setToStorage('cv_notifications', notifications);
  }, [notifications]);

  const addNotification = useCallback((type, message) => {
    const notif = { id: generateId(), type, message, read: false, timestamp: new Date().toISOString() };
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
