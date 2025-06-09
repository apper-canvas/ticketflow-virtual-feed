import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TabButton = ({ id, label, iconName, isActive, onClick, className = '', ...props }) => {
    return (
        <Button
            key={id}
            onClick={onClick}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            } ${className}`}
            {...props}
        >
            <ApperIcon name={iconName} size={18} className="mr-3 flex-shrink-0" />
            <span className="truncate">{label}</span>
        </Button>
    );
};

export default TabButton;