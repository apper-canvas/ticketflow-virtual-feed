import React from 'react';

const Button = ({ children, onClick, className = '', disabled = false, type = 'button', ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${className}`}
            type={type}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;