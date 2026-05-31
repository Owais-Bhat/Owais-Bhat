import { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen text-slate-950 overflow-hidden bg-[var(--bg)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <TopBar onMenuToggle={handleMenuToggle} />

        {/* Content */}
        <main className="app-content flex-1 overflow-y-auto bg-[linear-gradient(135deg,rgba(64,89,173,0.08),transparent_30%),linear-gradient(315deg,rgba(224,100,74,0.08),transparent_28%),#F7F8FB]">
          {children}
        </main>
      </div>
    </div>
  );
}
