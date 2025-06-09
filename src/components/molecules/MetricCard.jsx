import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const MetricCard = ({ title, value, iconName, iconColorClass, bgColorClass, delay = 0, className = '', ...props }) => {
    return (
        <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
            className={`hover:shadow-md transition-shadow ${className}`}
            {...props}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${bgColorClass}`}>
                    <ApperIcon name={iconName} className={iconColorClass} size={24} />
                </div>
            </div>
        </Card>
    );
};

export default MetricCard;