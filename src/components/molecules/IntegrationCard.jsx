import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const IntegrationCard = ({
    iconName,
    iconBgColorClass,
    iconColorClass,
    title,
    description,
    buttonLabel,
    onButtonClick,
    isConnected,
    className = '',
    ...props
}) => {
    return (
        <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${className}`} {...props}>
            <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-4 ${iconBgColorClass}`}>
                    <ApperIcon name={iconName} className={iconColorClass} size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
            <Button
                onClick={onButtonClick}
                className={`px-4 py-2 text-sm ${
                    isConnected
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                {buttonLabel}
            </Button>
        </div>
    );
};

export default IntegrationCard;