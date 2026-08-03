import React from 'react';

export default function SearchBar({
  placeholder = 'Search symbols, files, classes...',
  value,
  onChange,
  onClear,
  className = '',
}) {
  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <div className="absolute left-3 text-gray-500 pointer-events-none">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0d1117] text-gray-200 text-xs border border-[#30363d] rounded-md py-1.5 pl-9 pr-8 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] focus:border-[#00f0ff] placeholder-gray-600 font-mono"
      />
      {value ? (
        <button
          onClick={onClear}
          className="absolute right-2.5 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <div className="absolute right-2.5 flex items-center pointer-events-none text-[10px] text-gray-600 bg-[#161b22] px-1.5 py-0.5 border border-[#30363d] rounded font-mono select-none">
          /
        </div>
      )}
    </div>
  );
}
