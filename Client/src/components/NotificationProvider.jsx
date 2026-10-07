import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);
let notificationId = 0;

const defaultTitles = {
  success: 'Success',
  error: 'Error',
  info: 'Info',
  warning: 'Warning'
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const dismiss = useCallback((id) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }, []);

  const notify = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = notificationId += 1;
    const nextTitle = title || defaultTitles[type] || defaultTitles.info;

    setNotifications((current) => [
      ...current,
      { id, type, title: nextTitle, message }
    ]);

    window.setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const value = useMemo(() => ({
    notify,
    success: (message, title) => notify({ type: 'success', message, title }),
    error: (message, title) => notify({ type: 'error', message, title }),
    info: (message, title) => notify({ type: 'info', message, title }),
    warning: (message, title) => notify({ type: 'warning', message, title }),
    dismiss
  }), [dismiss, notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {notifications.map((notification) => (
          <div key={notification.id} className={`app-toast app-toast-${notification.type}`}>
            <div className="app-toast-accent" />
            <div className="app-toast-content">
              <div className="app-toast-header">
                <strong>{notification.title}</strong>
                <button type="button" className="app-toast-close" onClick={() => dismiss(notification.id)} aria-label="Close notification">
                  ×
                </button>
              </div>
              <div className="app-toast-message">{notification.message}</div>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};