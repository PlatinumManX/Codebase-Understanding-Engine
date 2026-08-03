import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, ghost, danger, purple
  size = 'md', // sm, md, lg
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variants = {
    primary: 'bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 hover:border-[#00f0ff]/50 shadow-[0_0_10px_rgba(0,240,255,0.05)] hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]',
    secondary: 'bg-[#30363d]/50 hover:bg-[#30363d] text-gray-200 border border-[#30363d] hover:border-gray-500',
    outline: 'bg-transparent text-gray-300 border border-[#30363d] hover:bg-[#161b22] hover:text-white',
    ghost: 'bg-transparent text-gray-400 hover:bg-[#161b22]/50 hover:text-gray-200',
    danger: 'bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 hover:border-red-500/50',
    purple: 'bg-[#a855f7]/10 hover:bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/30 hover:border-[#a855f7]/50 shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}
