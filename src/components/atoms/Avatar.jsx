import React from 'react';

const Avatar = ({ src, alt, className = '', ...props }) => {
    return (
        <img
            src={src}
            alt={alt}
            className={`w-12 h-12 rounded-full ${className}`}
            {...props}
        />
    );
};

export default Avatar;