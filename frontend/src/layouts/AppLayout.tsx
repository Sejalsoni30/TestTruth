import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { Navbar } from './Navbar.js';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen app-bg text-body relative selection:bg-accent/30 selection:text-body">
      {/* Corner Spotlight Overlay */}
      <div className="fixed inset-0 spotlight-overlay z-0 pointer-events-none"></div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
