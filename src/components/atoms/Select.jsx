import React from 'react';

const Select = ({ value, onChange, options, className = '', ...props }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${className}`}
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;