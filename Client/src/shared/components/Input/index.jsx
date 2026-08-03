import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  className = '',
  helperText,
  icon,
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-gray-500 flex items-center justify-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full bg-[#0d1117] text-gray-200 text-sm border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] focus:border-[#00f0ff] placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? 'pl-9' : ''
          } ${error ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500' : 'border-[#30363d]'}`}
        />
      </div>
      {error ? (
        <span className="text-xs text-red-400 mt-0.5">{error}</span>
      ) : (
        helperText && <span className="text-xs text-gray-500 mt-0.5">{helperText}</span>
      )}
    </div>
  );
}
