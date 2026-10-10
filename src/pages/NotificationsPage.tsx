import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NotificationItem } from '../types';
import { Bell, CheckCheck, Ticket, Briefcase, Brain, Calendar, Info } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      if (res.success) setNotifications(res.notifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAll = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ticket':
        return <Ticket className="w-4 h-4 text-emerald-600" />;
      case 'proposal':
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 'quiz':
        return <Brain className="w-4 h-4 text-violet-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campus Notification Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Event pass issuance, marketplace proposals, faculty announcements, and academic reminders.
          </p>
        </div>

        <button
          onClick={handleMarkAll}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            Your notification inbox is clean. No pending alerts.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(item => (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item.id)}
                className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  !item.read ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.title}</span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                    <div className="text-[10px] text-slate-400 mt-1">{item.createdAt}</div>
                  </div>
                </div>

                {!item.read && (
                  <span className="text-[11px] font-semibold text-indigo-600 shrink-0">
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
