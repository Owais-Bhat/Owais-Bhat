import { useNotification } from '../../hooks/useNotification';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineWarning, AiOutlineInfoCircle } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <AiOutlineCheckCircle className="w-5 h-5" />;
      case 'error':
        return <AiOutlineCloseCircle className="w-5 h-5" />;
      case 'warning':
        return <AiOutlineWarning className="w-5 h-5" />;
      default:
        return <AiOutlineInfoCircle className="w-5 h-5" />;
    }
  };

  const getColors = (type) => {
    const colors = {
      success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      error: 'bg-red-500/20 border-red-500/30 text-red-300',
      warning: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      info: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            glass-card p-4 flex items-start gap-3 animate-slide-in-right
            border ${getColors(notification.type)}
          `}
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
