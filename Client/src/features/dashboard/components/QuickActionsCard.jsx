import React from 'react';
import Card from '../../../shared/components/Card';
import { Link } from "react-router-dom";

export default function QuickActionsCard({ actions }) {
  const getIconAndStyle = (iconName) => {
    switch (iconName) {
      case 'upload':
        return {
          color: 'text-[#00f0ff]',
          bg: 'bg-[#00f0ff]/10 border-[#00f0ff]/20',
          hoverClass: 'hover:border-[#00f0ff]/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.08)] hover:-translate-y-0.5',
          arrowColor: 'group-hover:text-[#00f0ff] group-hover:border-[#00f0ff]/30 group-hover:bg-[#00f0ff]/10',
          svg: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          )
        };
      case 'graph':
        return {
          color: 'text-[#00f0ff]',
          bg: 'bg-[#00f0ff]/10 border-[#00f0ff]/20',
          hoverClass: 'hover:border-[#00f0ff]/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.08)] hover:-translate-y-0.5',
          arrowColor: 'group-hover:text-[#00f0ff] group-hover:border-[#00f0ff]/30 group-hover:bg-[#00f0ff]/10',
          svg: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          )
        };
      case 'flow':
        return {
          color: 'text-[#00f0ff]',
          bg: 'bg-[#00f0ff]/10 border-[#00f0ff]/20',
          hoverClass: 'hover:border-[#00f0ff]/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.08)] hover:-translate-y-0.5',
          arrowColor: 'group-hover:text-[#00f0ff] group-hover:border-[#00f0ff]/30 group-hover:bg-[#00f0ff]/10',
          svg: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        };
      case 'ai':
        return {
          color: 'text-[#c084fc]',
          bg: 'bg-[#a855f7]/10 border-[#a855f7]/20',
          hoverClass: 'hover:border-[#a855f7]/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.08)] hover:-translate-y-0.5',
          arrowColor: 'group-hover:text-[#c084fc] group-hover:border-[#a855f7]/30 group-hover:bg-[#a855f7]/10',
          svg: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )
        };
      default:
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-500/10 border-gray-500/20',
          hoverClass: 'hover:border-gray-500/40 hover:-translate-y-0.5',
          arrowColor: 'group-hover:text-white',
          svg: null
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const style = getIconAndStyle(action.icon);
        return (
          <Link key={idx} to={action.actionHash} className="group block">
            <Card
              className={`h-[92px] border-[#30363d] bg-[#161b22]/30 backdrop-blur-sm cursor-pointer transition-all duration-300 ${style.hoverClass}`}
              bodyClassName="p-3 h-full flex items-center justify-between gap-3"
            >
              <div className="flex items-center min-w-0 flex-1">
                {/* Icon Container */}
                <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 mr-3 transition-colors duration-300 ${style.color} ${style.bg}`}>
                  {style.svg}
                </div>
                {/* Details Container */}
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-[13px] font-semibold text-gray-200 font-sans tracking-wide truncate group-hover:text-white transition-colors duration-200">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-snug line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className={`w-6.5 h-6.5 rounded-full border border-[#30363d] flex items-center justify-center text-gray-500 shrink-0 transition-all duration-300 ${style.arrowColor}`}>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
