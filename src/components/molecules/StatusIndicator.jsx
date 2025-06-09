import React from 'react';

const StatusIndicator = ({ label, count, colorClass, shape = 'circle', className = '', ...props }) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded';
    return (
        <div className={`flex items-center justify-between ${className}`} {...props}>
            <div className="flex items-center">
                <div className={`w-3 h-3 ${colorClass} ${shapeClass} mr-3`}></div>
                <span className="text-sm text-gray-700">{label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{count}</span>
        </div>
    );
};

export default StatusIndicator;