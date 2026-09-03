'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { ToastType } from '@/lib/enum/toast';
import Toast from '@/lib/components/Toast/Toast';
import { registerToastEmitter } from '@/lib/utils/toast-emitter';

interface ToastContextProps {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const [duration, setDuration] = useState<number>(5000);

  const showToast = (message: string, type: ToastType, duration = 5000) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setOpen(true);
  };

  const hideToast = () => {
    setOpen(false);
  };

  useEffect(() => {
    registerToastEmitter(showToast);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        open={open}
        message={message}
        type={type}
        onClose={hideToast}
        duration={duration}
      />
    </ToastContext.Provider>
  );
};
