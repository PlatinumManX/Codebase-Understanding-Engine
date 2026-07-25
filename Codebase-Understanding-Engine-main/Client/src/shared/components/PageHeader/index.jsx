import React from 'react';

export default function PageHeader({
  title,
  description,
  breadcrumbs = [], // array of strings or nodes
  actions,
  className = '',
}) {
  return (
    <div className={`border-b border-[#30363d] pb-4 mb-5 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 min-w-0">
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono mb-1 select-none">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-gray-600">/</span>}
                  <span className={idx === breadcrumbs.length - 1 ? 'text-gray-400' : 'hover:text-gray-300 transition-colors'}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 className="text-lg font-semibold tracking-tight text-white truncate">{title}</h1>
          {description && <p className="text-xs text-gray-400 truncate">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2.5 shrink-0 sm:ml-4">{actions}</div>}
      </div>
    </div>
  );
}
