import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from '@/components/ui/Toast';

interface NotificationContextType {
  showNotification: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const showNotification = useCallback(
    (newMessage: string, newType: ToastType = 'info') => {
      setMessage(newMessage);
      setType(newType);
      setVisible(true);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
}
