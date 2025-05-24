import React, { createContext, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastNotification = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastNotification must be used within a ToastNotificationProvider');
  }
  return context;
};

interface ToastNotificationProviderProps {
  children: React.ReactNode;
}

export const ToastNotificationProvider: React.FC<ToastNotificationProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');

  const showToast = (message: string, type: ToastType = 'success') => {
    setMessage(message);
    setType(type);
    setVisible(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        className={`fixed top-4 right-4 bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'} toast-animation`}
      >
        <i className={`${type === 'success' ? 'ri-check-line text-success' : type === 'error' ? 'ri-close-line text-error' : 'ri-information-line text-secondary'} mr-2`}></i>
        <span>{message}</span>
      </div>
    </ToastContext.Provider>
  );
};
