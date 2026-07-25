import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../shared/context/ToastContext';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import AppRouter from '../routes/Router';
import ScrollToTop from '../routes/ScrollToTop';

function AppContent() {
  const { loading } = useAuth();

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

  return (
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}
