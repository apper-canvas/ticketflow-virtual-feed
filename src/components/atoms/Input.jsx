import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', rows, min, max, step, ...props }) => {
    const commonClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${className}`;

    if (rows) {
        return (
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`resize-none ${commonClasses}`}
                {...props}
            />
        );
    }

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={commonClasses}
            {...props}
        />
    );
};

export default Input;