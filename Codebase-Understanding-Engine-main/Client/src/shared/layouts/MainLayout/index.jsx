import React from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-on-surface">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Content scroll viewport */}
        <main className="flex-1 overflow-y-auto bg-canvas p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
