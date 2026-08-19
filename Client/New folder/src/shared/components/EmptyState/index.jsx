import React from 'react';
import Button from '../Button';

export default function EmptyState({
  title = 'No Data Found',
  description = 'There is currently no information available in this section.',
  actionLabel,
  onActionClick,
  actionHash,
  icon = 'folder', // folder, code, graph, chat
}) {
  const icons = {
    folder: (
      <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    code: (
      <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    graph: (
      <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    chat: (
      <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border border-[#30363d] border-dashed rounded-lg bg-[#161b22]/20 text-center max-w-md mx-auto">
      <div className="p-3 bg-[#0d1117] rounded-full border border-[#30363d] mb-4">
        {icons[icon] || icons.folder}
      </div>
      <h4 className="text-sm font-medium text-gray-300 tracking-wide">{title}</h4>
      <p className="text-xs text-gray-500 mt-1 max-w-xs">{description}</p>
      {(actionLabel && (onActionClick || actionHash)) && (
        <div className="mt-5">
          {actionHash ? (
            <a href={actionHash}>
              <Button variant="primary" size="sm">
                {actionLabel}
              </Button>
            </a>
          ) : (
            <Button variant="primary" size="sm" onClick={onActionClick}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
