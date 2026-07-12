import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdNotifications, MdCheckCircle, MdError, MdWarning, MdInfo, MdDoneAll, MdCampaign,
} from 'react-icons/md';
import supabase from '../../lib/supabase';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  subscribeToNotifications,
} from '../../lib/notificationsApi';
import { useAuth } from '../../hooks/useAuth';

const TYPE_ICONS = {
  success: { icon: MdCheckCircle, className: 'text-emerald-600 bg-emerald-50' },
  error: { icon: MdError, className: 'text-red-600 bg-red-50' },
  warning: { icon: MdWarning, className: 'text-amber-600 bg-amber-50' },
  announcement: { icon: MdCampaign, className: 'text-[#E0644A] bg-orange-50' },
  info: { icon: MdInfo, className: 'text-[#4059AD] bg-[#EEF4FF]' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = items.filter(n => !n.read_at).length;

  const load = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data } = await fetchNotifications(profile.id);
    setItems(data);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    load();
  }, [load]);

  // Live updates: prepend new notifications as they arrive
  useEffect(() => {
    if (!profile?.id) return undefined;
    const channel = subscribeToNotifications(profile.id, (row) => {
      setItems(prev => [row, ...prev].slice(0, 20));
    });
    return () => supabase.removeChannel(channel);
  }, [profile?.id]);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open) load();
  };

  const handleItemClick = async (n) => {
    setOpen(false);
    if (!n.read_at) {
      setItems(prev => prev.map(i => (i.id === n.id ? { ...i, read_at: new Date().toISOString() } : i)));
      markNotificationRead(n.id);
    }
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = async () => {
    const now = new Date().toISOString();
    setItems(prev => prev.map(i => ({ ...i, read_at: i.read_at || now })));
    await markAllNotificationsRead(profile.id);
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 text-slate-500 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-100"
        aria-label="Notifications"
      >
        <MdNotifications className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#E0644A] text-white text-[10px] font-extrabold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-bold text-slate-950 mb-0">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0E7C7B] hover:text-[#0A5F5E] transition-colors"
                >
                  <MdDoneAll className="w-4 h-4" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && items.length === 0 ? (
                <div className="py-10 flex justify-center">
                  <div className="spinner" />
                </div>
              ) : items.length === 0 ? (
                <div className="py-10 text-center px-6">
                  <MdNotifications className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 mb-0">No notifications yet.</p>
                </div>
              ) : (
                items.map((n) => {
                  const cfg = TYPE_ICONS[n.type] || TYPE_ICONS.info;
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50 ${
                        n.read_at ? '' : 'bg-[#EEF7F6]/60'
                      }`}
                    >
                      <span className={`p-1.5 rounded-lg shrink-0 ${cfg.className}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-sm truncate ${n.read_at ? 'text-slate-600' : 'font-bold text-slate-950'}`}>
                          {n.title}
                        </span>
                        {n.body && (
                          <span className="block text-xs text-slate-500 line-clamp-2">{n.body}</span>
                        )}
                        <span className="block text-[11px] text-slate-400 mt-0.5">{timeAgo(n.created_at)}</span>
                      </span>
                      {!n.read_at && <span className="w-2 h-2 rounded-full bg-[#0E7C7B] shrink-0 mt-1.5" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
