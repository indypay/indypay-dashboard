'use client';

import React from 'react';
import { Dropdown } from 'antd';
import { BsBell } from 'react-icons/bs';
import { useNotifications } from '@/lib/context/NotificationContext';
import type { AppNotification } from '@/lib/context/NotificationContext';

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const dropdownContent = (
    <div className="w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-default-100 rounded-lg shadow-lg border border-border-light overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-surface-dark">
        <span className="font-semibold text-sm">Notifications</span>
        {isConnected && <span className="text-xs text-success">Live</span>}
        {notifications.length > 0 && (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => markAllAsRead()}
              className="text-xs text-muted hover:text-foreground"
            >
              Mark all read
            </button>
            <span className="text-border-light">|</span>
            <button
              type="button"
              onClick={() => clearAll()}
              className="text-xs text-muted hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted text-sm">
            No notifications yet
          </div>
        ) : (
          <ul className="divide-y divide-border-light">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onRead={() => markAsRead(n.id)}
                onRemove={() => removeNotification(n.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <button
        type="button"
        className="relative p-1.5 md:p-2 hover:bg-brand-green-dark/30 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <BsBell className="text-muted-gray text-lg md:text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1 md:top-1.5 right-1 md:right-1.5 min-w-[8px] h-2 flex items-center justify-center px-1 bg-success text-white text-[10px] font-medium rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </Dropdown>
  );
}

function NotificationItem({
  notification,
  onRead,
  onRemove,
}: {
  notification: AppNotification;
  onRead: () => void;
  onRemove: () => void;
}) {
  const { type, title, message, read } = notification;

  return (
    <li
      className={`px-4 py-3 hover:bg-default-100/50 transition-colors cursor-pointer group ${
        !read ? 'bg-success/5' : 'bg-transparent'
      }`}
      onClick={() => !read && onRead()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!read) onRead();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex gap-3 items-start">
        {/* Read / unread dot */}
        <span
          className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
            read ? 'bg-border-light' : 'bg-success'
          }`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {(title || type) && (
                <div
                  className={`text-sm truncate ${
                    read
                      ? 'font-medium text-foreground'
                      : 'font-semibold text-foreground'
                  }`}
                >
                  {title || type || 'Notification'}
                </div>
              )}
              <p className="text-xs text-muted mt-0.5 break-words">{message}</p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                  read
                    ? 'border-border-light text-muted'
                    : 'border-success/40 bg-success/10 text-success'
                }`}
              >
                {read ? 'Read' : 'Unread'}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-foreground rounded transition-opacity text-xs"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default NotificationBell;
