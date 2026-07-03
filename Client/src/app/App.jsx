import React, { useEffect } from 'react';
import MainLayout from '../shared/layouts/MainLayout';
import AppRoutes from './AppRoutes';
import useRoute from '../shared/hooks/useRoute';
import { ToastProvider } from '../shared/context/ToastContext';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import LandingNavbar from '../features/landing/components/LandingNavbar';
import Footer from '../features/landing/components/Footer';

function AppContent() {
  const { route, navigate } = useRoute();
  const { user, loading } = useAuth();

  const protectedRoutes = ['dashboard', 'repository', 'graph', 'flow', 'ai', 'settings'];
  const isProtected = protectedRoutes.includes(route);

  useEffect(() => {
    if (!loading && isProtected && !user) {
      navigate('login');
    }
  }, [route, user, loading, navigate, isProtected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040609] flex items-center justify-center font-mono select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold animate-pulse">Initializing Session...</span>
        </div>
      </div>
    );
  }

  if (isProtected && !user) {
    return null; // Avoid flashing protected content
  }

  // Auth pages (no navbar, no footer)
  if (route === 'login' || route === 'register') {
    return <AppRoutes />;
  }

  // Public marketing pages
  const marketingRoutes = ['landing', 'about', 'contact', 'docs', 'pricing'];
  if (marketingRoutes.includes(route) || !isProtected) {
    return (
      <div className="bg-[#040609] min-h-screen text-gray-200 overflow-x-hidden flex flex-col justify-between selection:bg-[#00f0ff]/30 selection:text-white">
        <LandingNavbar />
        <div className="flex-grow">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    );
  }

  // Protected dashboard layout
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
