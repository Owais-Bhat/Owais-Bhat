import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { MENU_ITEMS } from '../../config';
import { canAccessPath } from '../../auth/permissions';
import { getFeatureByRoute } from '../../saas/features';
import Avatar from '../Common/Avatar';
import {
  MdClose, MdChevronRight,
  MdDashboard, MdBusiness, MdCreditCard, MdTrendingUp, MdSettings,
  MdPeople, MdPerson, MdAccountBalance, MdAccessTime, MdBook,
  MdDirectionsBus, MdChat, MdBarChart, MdAutoAwesome, MdSchool,
  MdGrade, MdNotifications, MdLogout, MdLightbulb, MdAdminPanelSettings,
} from 'react-icons/md';

const ICON_MAP = {
  MdDashboard, MdBusiness, MdCreditCard, MdTrendingUp, MdSettings,
  MdPeople, MdPerson, MdAccountBalance, MdAccessTime, MdBook,
  MdDirectionsBus, MdChat, MdBarChart, MdAutoAwesome, MdSchool,
  MdGrade, MdNotifications, MdLogout, MdLightbulb, MdAdminPanelSettings,
};

const ACTIVE_NAV_STYLE = {
  background: '#F4B860',
  color: '#101827',
  borderColor: '#F4B860',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.28)',
};

const ACTIVE_SUBNAV_STYLE = {
  background: '#FFFFFF',
  color: '#101827',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.18)',
};

const SUPER_ACTIVE_NAV_STYLE = {
  background: '#D9F99D',
  color: '#13210C',
  borderColor: '#D9F99D',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.32)',
};

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const { institution, hasFeature } = useAppData();
  const [expanded, setExpanded] = useState({});

  const role = profile?.role || user?.user_metadata?.role || 'student';
  const isSuperAdmin = role === 'super_admin';
  const canShowPath = (path) => {
    if (!canAccessPath(role, path)) return false;
    if (isSuperAdmin) return true;

    const feature = getFeatureByRoute(path);
    return !feature || !institution || hasFeature(feature.key);
  };
  const filterMenuItem = (item) => {
    if (item.subItems) {
      const subItems = item.subItems.filter(sub => canShowPath(sub.path));
      return subItems.length ? { ...item, subItems } : null;
    }
    return canShowPath(item.path) ? item : null;
  };
  const menuItems = (MENU_ITEMS[role] || MENU_ITEMS.student)
    .map(filterMenuItem)
    .filter(Boolean);
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'User';
  const activeStyle = isSuperAdmin ? SUPER_ACTIVE_NAV_STYLE : ACTIVE_NAV_STYLE;
  const activeDotColor = isSuperAdmin ? '#13210C' : '#101827';
  const sidebarBackground = isSuperAdmin
    ? 'linear-gradient(180deg, #120F22 0%, #231A3A 52%, #101827 100%)'
    : 'linear-gradient(180deg, #111827 0%, #182133 100%)';

  const go = (path) => { navigate(path); if (window.innerWidth < 1024) onClose(); };
  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));
  const isActive = (path) => location.pathname === path;
  const hasActive = (subs) => subs?.some(s => location.pathname === s.path);
  const getIcon = (name) => { const I = ICON_MAP[name]; return I ? <I className="w-4.5 h-4.5" /> : null; };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 lg:hidden z-40 backdrop-blur-sm" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col
        border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ background: sidebarBackground }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: isSuperAdmin ? 'linear-gradient(135deg, #A3E635, #38BDF8)' : 'linear-gradient(135deg, #0E7C7B, #E0644A)' }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 text-white">
                <path d="M12 3L2 8l10 5 10-5-10-5z" fill="currentColor" opacity="0.9"/>
                <path d="M2 16l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold font-display text-white tracking-tight">
                {isSuperAdmin ? 'CyberMilo HQ' : 'CyberMilo'}
              </span>
              {isSuperAdmin && (
                <p className="text-[10px] uppercase tracking-[0.18em] text-lime-200/80 mb-0">
                  Platform
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-white/10 shrink-0">
          <button
            onClick={() => go('/profile')}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 transition group"
          >
            <Avatar name={fullName} src={profile?.avatar_url} size="sm" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-white truncate group-hover:text-[#F4B860] transition-colors">
                {fullName}
              </p>
              <p className="text-xs text-white/40 capitalize truncate">
                {isSuperAdmin ? 'Platform Owner' : role.replace('_', ' ')}
              </p>
            </div>
          </button>
          {isSuperAdmin && (
            <div className="mt-3 rounded-lg border border-lime-300/20 bg-lime-300/10 px-3 py-2">
              <p className="text-xs font-bold text-lime-100 mb-0">SaaS Admin Mode</p>
              <p className="text-[11px] text-white/45 mb-0">Manage institutions, plans, and tenants.</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {menuItems.map((item) => (
            <div key={item.key}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggle(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group
                      ${hasActive(item.subItems)
                        ? 'font-bold border'
                        : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    style={hasActive(item.subItems) ? activeStyle : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <span className="transition-colors" style={hasActive(item.subItems) ? { color: activeDotColor } : undefined}>
                        {getIcon(item.iconName)}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </span>
                    <MdChevronRight className={`w-4 h-4 transition-transform duration-200 ${expanded[item.key] ? 'rotate-90' : ''}`} />
                  </button>
                  {expanded[item.key] && (
                    <div className="mt-0.5 ml-4 pl-3 border-l border-white/10 space-y-0.5 pb-1">
                      {item.subItems.map(sub => (
                        <button key={sub.key} onClick={() => go(sub.path)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                            ${isActive(sub.path)
                              ? 'font-bold'
                              : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                          style={isActive(sub.path) ? ACTIVE_SUBNAV_STYLE : undefined}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button onClick={() => go(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group
                    ${isActive(item.path)
                      ? 'font-bold border'
                      : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                  style={isActive(item.path) ? activeStyle : undefined}
                >
                  <span className="transition-colors" style={isActive(item.path) ? { color: activeDotColor } : undefined}>
                    {getIcon(item.iconName)}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: activeDotColor }} />}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 shrink-0 border-t border-white/10 pt-3">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-all group"
          >
            <MdLogout className="w-4.5 h-4.5" />
            <span className="font-medium">Sign out</span>
          </button>
          <p className="text-center text-white/25 text-xs mt-3">
            {isSuperAdmin ? 'CyberMilo SaaS Console' : 'CyberMilo ERP v1.0'}
          </p>
        </div>
      </aside>
    </>
  );
}
