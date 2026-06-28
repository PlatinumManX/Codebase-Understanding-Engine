import React from 'react';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

export default function QuickActionsCard({ actions }) {
  const getIconSvg = (iconName) => {
    switch (iconName) {
      case 'upload':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        );
      case 'graph':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        );
      case 'flow':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'ai':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => (
        <Card
          key={idx}
          className="hover:border-[#00f0ff]/30 transition-all duration-300 flex flex-col justify-between"
          bodyClassName="flex flex-col justify-between h-full min-h-[145px]"
        >
          <div className="space-y-1.5">
            <div className="w-7 h-7 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#00f0ff] mb-2">
              {getIconSvg(action.icon)}
            </div>
            <h4 className="text-xs font-semibold text-gray-200 font-mono tracking-wide">{action.title}</h4>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">{action.description}</p>
          </div>
          <div className="pt-3">
            <a href={action.actionHash} className="w-full block">
              <Button variant="outline" size="sm" className="w-full text-xs font-mono justify-between">
                Launch Explorer
                <svg className="w-3 h-3 ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
