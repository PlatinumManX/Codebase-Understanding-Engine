import React from 'react';
import Card from '../Card';
import Badge from '../Badge';

export default function StatCard({
  label,
  value,
  change,
  type = 'info', // info, success, warning, error, purple
  description,
  className = '',
}) {
  const glows = {
    info: 'hover:shadow-[0_0_15px_rgba(0,240,255,0.08)] hover:border-[#00f0ff]/40',
    success: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.08)] hover:border-[#10b981]/40',
    warning: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.08)] hover:border-[#f59e0b]/40',
    error: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.08)] hover:border-red-500/40',
    purple: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.08)] hover:border-[#a855f7]/40',
  };

  const textColors = {
    info: 'text-[#00f0ff]',
    success: 'text-[#10b981]',
    warning: 'text-[#f59e0b]',
    error: 'text-red-400',
    purple: 'text-[#c084fc]',
  };

  return (
    <Card className={`group transition-all duration-300 ${glows[type] || glows.info} ${className}`}>
      <div className="flex justify-between items-start">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider truncate mr-2">{label}</span>
        {change && (
          <Badge variant={type === 'purple' ? 'purple' : type} size="sm">
            {change}
          </Badge>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl font-semibold font-mono tracking-tight ${textColors[type] || textColors.info}`}>
          {value}
        </span>
      </div>
      {description && (
        <p className="mt-2 text-xs text-gray-500 font-mono truncate">{description}</p>
      )}
    </Card>
  );
}
