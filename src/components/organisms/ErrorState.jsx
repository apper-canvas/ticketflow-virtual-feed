import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message = 'Something went wrong.', onRetry, className = '', ...props }) => {
    return (
        <div className={`p-6 ${className}`} {...props}>
            <div className="text-center">
                <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                <p className="text-gray-600 mb-4">{message}</p>
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        className="bg-primary text-white hover:bg-primary/90"
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorState;