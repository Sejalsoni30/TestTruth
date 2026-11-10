import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { Navbar } from './Navbar.js';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-bg text-body selection:bg-accent/20 selection:text-body">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-bg">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
