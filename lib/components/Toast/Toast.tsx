'use client';
import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/react';

import { ToastType } from '@/lib/enum/toast';
import ErrorIcon from '@/public/assests/Icon/ErrorIcon';
import HintIcon from '@/public/assests/Icon/HintIcon';
import SuccessIcon from '@/public/assests/Icon/SuccessIcon';
import WarnIcon from '@/public/assests/Icon/WarnIcon';

interface ToastProps {
  open: boolean;
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const toastIcons: Record<ToastType, JSX.Element> = {
    hint: <HintIcon />,
    success: <SuccessIcon />,
    warn: <WarnIcon />,
    error: <ErrorIcon />,
  };

  const handleClose = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    onClose();
  };

  useEffect(() => {
    if (open && message) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const id = setTimeout(() => {
        handleClose();
      }, duration);

      setTimeoutId(id);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [open, message, duration]);

  if (!open) return null;

  return (
    <Popover isOpen={open} onClose={handleClose}>
      <PopoverTrigger>
        <div></div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-center space-x-6 px-2 py-2">
          {toastIcons[type]}
          <span>{message}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Toast;
