import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MENU_ITEMS } from '../../config';
import { MdClose, MdChevronRight, MdDashboard, MdBusiness, MdCreditCard, MdTrendingUp, MdSettings, MdPeople, MdPerson, MdAttachFile, MdAccountBalance, MdAccessTime, MdBook, MdVideoLibrary, MdDirectionsBus, MdChat, MdBarChart, MdLightbulb } from 'react-icons/md';

const ICON_MAP = {
  MdDashboard,
  MdBusiness,
  MdCreditCard,
  MdTrendingUp,
  MdSettings,
  MdPeople,
  MdPerson,
  MdAttachFile,
  MdAccountBalance,
  MdAccessTime,
  MdBook,
  MdVideoLibrary,
  MdDirectionsBus,
  MdChat,
  MdBarChart,
  MdLightbulb,
};

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [expandedItems, setExpandedItems] = useState({});

  const userRole = user?.user_metadata?.role || profile?.role || 'student';
  const menuItems = MENU_ITEMS[userRole] || MENU_ITEMS.student;

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleExpand = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const isActive = (path) => location.pathname === path;
  const isSubActive = (subItems) => subItems?.some(sub => location.pathname === sub.path);

  const getIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static left-0 top-0 h-screen w-64 z-50
          bg-gradient-to-b from-glass-dark/95 to-glass-dark/80 backdrop-blur-lg
          border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden p-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* User info section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-blue to-neon-cyan flex items-center justify-center text-sm font-bold text-white">
              {String(profile?.first_name || 'U').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.first_name || 'User'}
              </p>
              <p className="text-xs text-white/50 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.key}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.key)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${isSubActive(item.subItems)
                        ? 'bg-gradient-to-r from-primary-blue/30 to-neon-cyan/20 text-neon-cyan border-l-2 border-neon-cyan'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(item.iconName)}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <MdChevronRight
                      className={`w-5 h-5 transition-transform duration-200 ${
                        expandedItems[item.key] ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Submenu */}
                  {expandedItems[item.key] && (
                    <div className="mt-2 ml-4 space-y-2 border-l border-white/10 pl-4">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.key}
                          onClick={() => handleNavigate(subItem.path)}
                          className={`
                            w-full text-left px-4 py-2 rounded-lg text-sm
                            transition-all duration-200
                            ${isActive(subItem.path)
                              ? 'bg-neon-cyan/20 text-neon-cyan font-medium'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                            }
                          `}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-blue/30 to-neon-cyan/20 text-neon-cyan border-l-2 border-neon-cyan'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {getIcon(item.iconName)}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">CyberMilo © 2024</p>
        </div>
      </div>
    </>
  );
}
