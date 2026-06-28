import React, { useState } from 'react';
import useRoute from '../../hooks/useRoute';

export default function Sidebar() {
  const { route } = useRoute();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      hash: 'dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      name: 'Repository',
      hash: 'repository',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
        </svg>
      )
    },
    {
      name: 'Graph Explorer',
      hash: 'graph',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      name: 'Execution Flow',
      hash: 'flow',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      name: 'AI Assistant',
      hash: 'ai',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      name: 'Settings',
      hash: 'settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`bg-[#0d1117] border-r border-[#30363d] flex flex-col justify-between transition-all duration-300 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      } shrink-0 z-20`}
    >
      {/* Top Section */}
      <div>
        {/* Brand / Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#30363d] min-h-[57px]">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#00f0ff] font-mono">CM</span>
              </div>
              <span className="text-xs font-semibold tracking-wider text-white font-mono">CODEMAP<span className="text-[#00f0ff]">AI</span></span>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto w-6 h-6 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#00f0ff] font-mono">CM</span>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-300 hover:bg-[#161b22]/50 p-1 rounded transition-colors hidden md:block cursor-pointer"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-305 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = route === item.hash;
            return (
              <a
                key={item.name}
                href={`#${item.hash}`}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#161b22] text-[#00f0ff] border-l-2 border-[#00f0ff] pl-2.5'
                    : 'text-gray-400 hover:bg-[#161b22]/40 hover:text-gray-200 border-l-2 border-transparent'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <span className={`shrink-0 transition-colors ${isActive ? 'text-[#00f0ff]' : 'text-gray-500 group-hover:text-gray-400'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="font-mono truncate">{item.name}</span>}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#30363d] p-3 space-y-2 bg-[#0d1117]/55">
        {/* Profile Card */}
        <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#c084fc] font-mono">D</span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-200 truncate leading-none">Developer</p>
              <span className="text-[9px] text-gray-500 font-mono truncate block mt-1">mpr_dev@codemap.ai</span>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => alert('Logout triggered (UI Simulation)')}
          className={`flex items-center gap-3 w-full px-3 py-2 text-xs font-medium rounded-md text-red-400/80 hover:bg-red-950/20 hover:text-red-400 transition-colors cursor-pointer border border-transparent ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span className="font-mono">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
