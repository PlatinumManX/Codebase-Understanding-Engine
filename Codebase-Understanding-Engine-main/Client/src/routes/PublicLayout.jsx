import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from '../features/landing/components/LandingNavbar';
import Footer from '../features/landing/components/Footer';

export default function PublicLayout() {
  return (
    <div className="bg-[#040609] min-h-screen text-gray-200 overflow-x-hidden flex flex-col justify-between selection:bg-[#00f0ff]/30 selection:text-white">
      <LandingNavbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
