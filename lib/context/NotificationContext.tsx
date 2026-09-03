'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import axios from '@/app/api/axios';
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
} from '../constants/apiConstants/apiConstants';

/** Single notification item from API or socket */
export interface ApiNotificationItem {
  id: string;
  userId?: string;
  type: string;
  title: string;
  message: string;
  data?: unknown;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

/** API response when fetching notification list */
export interface NotificationListResponse {
  data: ApiNotificationItem[];
  pagination: { totalItems: number; limit: number; page: number };
}

interface NotificationListEnvelope {
  statusCode: number;
  message: string;
  success: boolean;
  data: NotificationListResponse;
}

/** Normalized notification used in the app (createdAt/readAt as numbers for sorting) */
export interface AppNotification {
  id: string;
  userId?: string;
  type: string;
  title: string;
  message: string;
  data?: unknown;
  read: boolean;
  readAt: number | null;
  createdAt: number;
}

/** Payload sent over socket (may be full item or legacy { type, title, message }) */
export type NotificationPayload =
  | ApiNotificationItem
  | {
      type?: string;
      title?: string;
      message: string;
    };

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  /** Replace or merge notifications from API list response (e.g. after fetch) */
  setFromApiResponse: (response: NotificationListResponse) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

const getNotificationSocketUrl = () => {
  const base =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SOCKET_URL?.trim()
      ? process.env.NEXT_PUBLIC_SOCKET_URL.replace(/\/$/, '')
      : 'http://localhost:4000';
  return `${base}/notifications`;
};

function parseTimestamp(value: string | null | undefined): number | null {
  if (value == null) return null;
  const t = typeof value === 'string' ? new Date(value).getTime() : value;
  return Number.isNaN(t) ? null : t;
}

function toAppNotification(item: ApiNotificationItem): AppNotification {
  return {
    id: item.id,
    userId: item.userId,
    type: item.type,
    title: item.title,
    message: item.message,
    data: item.data,
    read: item.read,
    readAt: parseTimestamp(item.readAt) ?? null,
    createdAt: parseTimestamp(item.createdAt) ?? Date.now(),
  };
}

function isApiNotificationItem(
  p: NotificationPayload,
): p is ApiNotificationItem {
  return typeof (p as ApiNotificationItem).id === 'string' && 'createdAt' in p;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((payload: NotificationPayload) => {
    const notification: AppNotification = isApiNotificationItem(payload)
      ? toAppNotification(payload)
      : {
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          type: payload.type ?? 'info',
          title: payload.title ?? '',
          message: payload.message,
          read: false,
          readAt: null,
          createdAt: Date.now(),
        };
    setNotifications((prev) => {
      const withoutCurrent = prev.filter((n) => n.id !== notification.id);
      return [notification, ...withoutCurrent].slice(0, 50);
    });
  }, []);

  const setFromApiResponse = useCallback(
    (response: NotificationListResponse) => {
      const list = response.data.map(toAppNotification);
      setNotifications(list);
    },
    [],
  );

  const fetchNotifications = useCallback(async () => {
    try {
      const response =
        await axios.get<NotificationListEnvelope>(GET_NOTIFICATIONS);
      setFromApiResponse(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notification list:', error);
    }
  }, [setFromApiResponse]);

  const markAsRead = useCallback((id: string) => {
    let previousReadState: boolean | null = null;
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        previousReadState = n.read;
        return { ...n, read: true, readAt: n.readAt ?? Date.now() };
      }),
    );

    axios.patch(`${MARK_NOTIFICATION_AS_READ}/${id}/read`).catch(() => {
      // Revert optimistic update if backend update fails.
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id && previousReadState !== null
            ? {
                ...n,
                read: previousReadState,
                readAt: previousReadState ? n.readAt : null,
              }
            : n,
        ),
      );
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    let previousNotifications: AppNotification[] = [];
    setNotifications((prev) => {
      previousNotifications = prev;
      return prev.map((n) => ({
        ...n,
        read: true,
        readAt: n.readAt ?? Date.now(),
      }));
    });

    axios.patch(MARK_ALL_NOTIFICATIONS_AS_READ).catch(() => {
      // Revert optimistic update if backend update fails.
      setNotifications(previousNotifications);
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = Cookies.get('atk');
    const url = getNotificationSocketUrl();

    if (!token) {
      return;
    }

    // Load existing user notifications on login/dashboard mount.
    fetchNotifications();

    const socketInstance = io(url, {
      auth: { token },
      path: '/socket.io',
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
    });

    socketInstance.on('notification', (payload: NotificationPayload) => {
      addNotification(payload);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off('notification');
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [addNotification, fetchNotifications]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    setFromApiResponse,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
}
