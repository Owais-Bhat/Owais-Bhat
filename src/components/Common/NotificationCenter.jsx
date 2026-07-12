import { useNotification } from '../../hooks/useNotification';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';

const TYPES = {
  success: {
    icon: MdCheckCircle,
    classes: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    bar: 'bg-emerald-500',
  },
  error: {
    icon: MdError,
    classes: 'bg-red-500/15 border-red-500/30 text-red-300',
    bar: 'bg-red-500',
  },
  warning: {
    icon: MdWarning,
    classes: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    bar: 'bg-amber-500',
  },
  info: {
    icon: MdInfo,
    classes: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
    bar: 'bg-blue-500',
  },
};

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[9999] w-80 space-y-2 pointer-events-none">
      {notifications.map((n) => {
        const cfg = TYPES[n.type] || TYPES.info;
        const Icon = cfg.icon;
        return (
          <div
            key={n.id}
            className={`
              pointer-events-auto
              relative flex items-start gap-3
              backdrop-blur-xl border rounded-xl px-4 py-3.5
              shadow-2xl overflow-hidden
              animate-slide-in-right
              ${cfg.classes}
            `}
          >
            {/* Accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar} rounded-l-xl`} />

            <Icon className="w-5 h-5 shrink-0 mt-0.5 ml-1" />

            <p className="flex-1 text-sm font-medium leading-snug pr-1">
              {n.message}
            </p>

            <button
              onClick={() => removeNotification(n.id)}
              className="shrink-0 p-0.5 rounded-md hover:bg-white/10 transition-colors text-current opacity-60 hover:opacity-100"
            >
              <MdClose className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
