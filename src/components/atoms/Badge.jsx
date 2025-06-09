import React from 'react';

const Badge = ({ children, className = '', ...props }) => {
    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;