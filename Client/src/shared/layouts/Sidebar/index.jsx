import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import useAuth from '../../../features/auth/hooks/useAuth';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard'
    },
    {
      name: 'Upload ZIP',
      path: '/repository',
      icon: 'upload_file'
    },
    {
      name: 'Graph Explorer',
      path: '/graph',
      icon: 'hub'
    },
    {
      name: 'Execution Flow',
      path: '/flow',
      icon: 'account_tree'
    },
    {
      name: 'AI Assistant',
      path: '/assistant',
      icon: 'smart_toy'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: 'settings'
    },
    {
      name: 'Docs',
      path: '/docs',
      icon: 'description'
    }
  ];

  return (
    <aside
      className={`fixed md:relative left-0 top-0 h-screen bg-[#eff4ff] border-r border-[#c3c6d7] flex flex-col py-4 z-50 transition-all duration-300 select-none ${
        isCollapsed ? 'w-16' : 'w-[240px]'
      } shrink-0`}
    >
      {/* Brand logo & collapse switch */}
      <div className="px-4 mb-8 flex items-center justify-between min-h-[40px]">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            </div>
            <div>
              <h1 className="text-[15px] font-extrabold font-display text-primary leading-tight">CodeMap AI</h1>
              <p className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold opacity-75">Intelligent Engine</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white shadow-sm mx-auto">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-outline hover:text-primary p-1 rounded hover:bg-[#dce9ff]/50 transition-colors hidden md:block cursor-pointer shrink-0"
        >
          <span className={`material-symbols-outlined transition-transform duration-350 ${isCollapsed ? 'rotate-180' : ''}`}>
            first_page
          </span>
        </button>
      </div>

      {/* Menu Navigation Links */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-[#dce9ff] border-l-4 border-primary font-bold'
                  : 'text-on-surface-variant hover:bg-[#dce9ff]/50 hover:text-primary'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="text-xs font-semibold tracking-wide font-sans">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile and Logout Section */}
      <div className="mt-auto px-2 space-y-2 border-t border-[#c3c6d7] pt-4">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-[#dbe1ff] border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-xs font-display">
            {user?.name ? user.name[0].toUpperCase() : 'D'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs font-bold text-on-surface truncate">
                {user?.name || 'Developer'}
              </p>
              <span className="text-[9px] text-outline font-semibold truncate block mt-0.5">
                {user?.email || 'mpr_dev@codemap.ai'}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-bold rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          {!isCollapsed && <span className="font-sans">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
