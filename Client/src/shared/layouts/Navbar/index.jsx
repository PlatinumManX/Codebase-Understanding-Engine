import React, { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import Badge from '../../components/Badge';
import useAuth from '../../../features/auth/hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const [activeRepoName, setActiveRepoName] = useState('codemap-ai-core');

  useEffect(() => {
    // Listen for changes in localStorage for active repo name updates
    const handleStorageChange = () => {
      const name = localStorage.getItem('active_repository_name');
      if (name) setActiveRepoName(name);
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] flex justify-between items-center px-6 z-40 select-none shrink-0">
      {/* Left: Active Repository Status */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[10px] font-bold text-outline uppercase tracking-wider shrink-0">
          CodeMap AI
        </span>
        <span className="text-[#c3c6d7] text-sm shrink-0">/</span>
        <div className="flex items-center gap-2 min-w-0 bg-[#eff4ff] px-2.5 py-1 rounded-lg border border-primary/10">
          <span className="material-symbols-outlined text-primary text-[16px]">folder</span>
          <span className="text-xs font-semibold text-primary truncate">
            {activeRepoName}
          </span>
          <Badge variant="success" size="sm" className="hidden sm:inline-flex shrink-0 font-sans">
            active
          </Badge>
        </div>
      </div>

      {/* Middle: Search Bar (hidden on mobile) */}
      <div className="hidden md:flex flex-1 justify-center max-w-xs px-4">
        <SearchBar placeholder="Search codebase..." />
      </div>

      {/* Right: Actions and Profile */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Help Cog */}
        <button 
          onClick={() => alert('Demo Help: Checkout docs page inside settings.')}
          className="p-2 text-on-surface-variant hover:bg-[#eff4ff] hover:text-primary transition-colors rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
        </button>

        {/* Notifications */}
        <button 
          onClick={() => alert('Demo Notifications: No new alerts.')}
          className="p-2 text-on-surface-variant hover:bg-[#eff4ff] hover:text-primary transition-colors rounded-full relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-[1px] bg-[#e2e8f0] mx-1"></div>

        {/* User Profile display */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#dbe1ff] border border-primary/20 flex items-center justify-center font-bold text-xs text-primary font-display shrink-0 transition-all group-hover:border-primary">
            {user?.name ? user.name[0].toUpperCase() : 'D'}
          </div>
          <span className="font-sans text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors hidden sm:inline">
            {user?.name || 'Developer'}
          </span>
        </div>
      </div>
    </header>
  );
}
