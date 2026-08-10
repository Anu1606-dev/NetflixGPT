import React, { useState } from 'react';
import Header from './Header';
import { DUMMY_NOTIFICATIONS } from '../Utils/notifications';

const ICONS = {
  new_release: {
    bg: "bg-red-600",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <polygon points="6 3 20 12 6 21 6 3" />
      </svg>
    ),
  },
  leaving_soon: {
    bg: "bg-amber-600",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  recommendation: {
    bg: "bg-purple-600",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
      </svg>
    ),
  },
  reminder: {
    bg: "bg-blue-600",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  account: {
    bg: "bg-gray-600",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-3.3 3.6-5.5 8-5.5s8 2.2 8 5.5" />
      </svg>
    ),
  },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative bg-gradient-to-b from-[#1a0000] via-black to-black min-h-screen">
      <Header showProfileIcon={true} />

      <div className="pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 md:px-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-400 text-sm mt-1">{unreadCount} unread</p>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-xs sm:text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
              >
                Mark all as read
              </button>
              <button
                onClick={clearAll}
                className="text-xs sm:text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-16">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500 mb-4">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h2 className="text-white text-lg font-semibold mb-1">You're all caught up</h2>
            <p className="text-gray-400 text-sm">No new notifications right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => {
              const icon = ICONS[n.type] || ICONS.account;
              return (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`flex items-start gap-3 sm:gap-4 text-left p-3 sm:p-4 rounded-xl transition ${
                    n.unread ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${icon.bg}`}>
                    {icon.svg}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm sm:text-base font-semibold truncate">
                        {n.title}
                      </p>
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">{n.time}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;