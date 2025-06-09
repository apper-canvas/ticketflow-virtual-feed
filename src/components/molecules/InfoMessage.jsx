import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const InfoMessage = ({ iconName, iconColorClass, title, message, className = '', ...props }) => {
    return (
        <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`} {...props}>
            <div className="flex items-center mb-2">
                <ApperIcon name={iconName} className={`mr-2 ${iconColorClass}`} size={16} />
                <h4 className="text-sm font-medium text-yellow-800">{title}</h4>
            </div>
            <p className="text-sm text-yellow-700">{message}</p>
        </div>
    );
};

export default InfoMessage;