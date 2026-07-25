import React from 'react';

export default function Badge({
  children,
  variant = 'info', // info, success, warning, error, purple, neutral
  size = 'md', // sm, md
  className = '',
}) {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded-full';
  
  const variants = {
    info: 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/25',
    success: 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/25',
    warning: 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/25',
    error: 'bg-red-500/10 text-red-400 border border-red-500/25',
    purple: 'bg-[#a855f7]/10 text-[#c084fc] border border-[#a855f7]/25',
    neutral: 'bg-[#30363d]/50 text-gray-400 border border-[#30363d]',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px] leading-3',
    md: 'px-2.5 py-0.5 text-xs leading-4',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
