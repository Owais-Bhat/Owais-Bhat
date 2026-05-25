import { useState } from 'react';
import { MdMenu, MdNotifications, MdSettings, MdLogout } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

export default function TopBar({ onMenuToggle }) {
  const { user, logout, profile } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border-b border-white/10 px-6 py-4 flex items-center justify-between">
      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-white/60 hover:text-white transition-colors"
        >
          <MdMenu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold gradient-text">CyberMilo</h2>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
          <MdNotifications className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-white/60 hover:text-white transition-colors">
          <MdSettings className="w-6 h-6" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-blue to-neon-cyan flex items-center justify-center text-xs font-bold">
              {getInitials(user?.email || 'U')}
            </div>
            <span className="text-sm font-medium text-white/80">{profile?.first_name || 'User'}</span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-glass-dark border border-white/10 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-white/10">
                <p className="text-sm font-medium">{profile?.first_name || 'User'}</p>
                <p className="text-xs text-white/50">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <MdLogout className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
