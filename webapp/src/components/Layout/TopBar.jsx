import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMenu, MdSettings, MdLogout, MdPerson, MdSearch } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { canAccessPath } from '../../auth/permissions';
import NotificationBell from '../Common/NotificationBell';

export default function TopBar({ onMenuToggle, onSearchOpen }) {
  const navigate = useNavigate();
  const { user, logout, profile } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const initials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase() || 'U';
  const role = profile?.role || user?.user_metadata?.role || 'student';
  const canOpenSettings = canAccessPath(role, '/settings');

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm">
      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-slate-600 hover:text-slate-950 transition-colors"
        >
          <MdMenu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-950 font-display mb-0">CyberMilo</h2>
          <p className="text-xs text-slate-500 hidden sm:block">Education operations workspace</p>
        </div>
      </div>

      {/* Right: Search, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {onSearchOpen && (
          <>
            <button
              onClick={onSearchOpen}
              className="hidden md:flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#0E7C7B]/40 transition-colors text-slate-400 text-sm w-56"
            >
              <MdSearch className="w-4.5 h-4.5 shrink-0" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="text-[10px] font-bold text-slate-400 border border-slate-200 bg-white rounded px-1.5 py-0.5">Ctrl K</kbd>
            </button>
            <button
              onClick={onSearchOpen}
              className="md:hidden p-2 text-slate-500 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-100"
            >
              <MdSearch className="w-6 h-6" />
            </button>
          </>
        )}

        <NotificationBell />

        {canOpenSettings && (
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-slate-500 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-100"
          >
            <MdSettings className="w-6 h-6" />
          </button>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E7C7B] to-[#E0644A] flex items-center justify-center text-xs font-bold text-white">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover rounded-lg" />
                : initials}
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">{profile?.first_name || 'User'}</span>
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-2xl z-50">
                <div className="p-4 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-950">{profile?.first_name} {profile?.last_name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  <span className="text-xs text-[#0E7C7B] capitalize mt-1 block font-semibold">{profile?.role?.replace('_', ' ')}</span>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition"
                  >
                    <MdPerson className="w-4 h-4" /> My Profile
                  </button>
                  {canOpenSettings && (
                    <button
                      onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition"
                    >
                      <MdSettings className="w-4 h-4" /> Settings
                    </button>
                  )}
                  <div className="border-t border-slate-200 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <MdLogout className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
