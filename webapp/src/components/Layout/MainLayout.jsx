import { useEffect, useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import CommandPalette from '../Common/CommandPalette';

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen text-slate-950 overflow-hidden bg-[var(--bg)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <TopBar onMenuToggle={handleMenuToggle} onSearchOpen={() => setPaletteOpen(true)} />

        {/* Content */}
        <main className="app-content flex-1 overflow-y-auto bg-[linear-gradient(135deg,rgba(64,89,173,0.08),transparent_30%),linear-gradient(315deg,rgba(224,100,74,0.08),transparent_28%),#F7F8FB]">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
