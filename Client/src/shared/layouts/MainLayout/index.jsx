import React from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0e14] text-gray-200">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Content scroll viewport */}
        <main className="flex-1 overflow-y-auto bg-[#0b0e14] p-4 sm:p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
