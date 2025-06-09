import React, { forwardRef } from 'react';

const TextArea = forwardRef(({ 
  label, 
  error, 
  className = '', 
  rows = 4,
  maxLength,
  showCount = false,
  ...props 
}, ref) => {
  const value = props.value || '';
  const currentLength = value.length;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm resize-y
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {showCount && maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {showCount && !maxLength && (
        <p className="mt-1 text-xs text-gray-500">
          {currentLength} characters
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;