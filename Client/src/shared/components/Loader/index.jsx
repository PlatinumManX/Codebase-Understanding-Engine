import React from 'react';

export default function Loader({
  size = 'md', // sm, md, lg
  text = 'Loading codebase data...',
  subtitle = 'Parsing files & drawing call graph...',
  fullPage = false,
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className={`${sizeClasses[size]} text-[#00f0ff] animate-spin`}>
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-gray-300 font-mono tracking-wide">{text}</p>
      )}
      {subtitle && (
        <p className="mt-1.5 text-xs text-gray-500 font-mono">{subtitle}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-[#0d1117] flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}
