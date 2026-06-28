import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  headerActions,
  footer,
  className = '',
  bodyClassName = '',
  onClick,
}) {
  const isClickable = !!onClick;
  return (
    <div
      onClick={onClick}
      className={`bg-[#161b22]/50 border border-[#30363d] rounded-lg transition-all duration-200 ${
        isClickable ? 'hover:border-gray-500 hover:bg-[#161b22]/85 cursor-pointer' : ''
      } ${className}`}
    >
      {(title || subtitle || headerActions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-medium text-gray-200 truncate">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2 ml-4 shrink-0">{headerActions}</div>}
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className="px-4 py-2.5 border-t border-[#30363d] bg-[#0d1117]/30 text-xs text-gray-400 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
