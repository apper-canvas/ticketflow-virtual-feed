import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const LoadingState = ({ type = 'page', message = 'Loading data...', className = '' }) => {
    if (type === 'dashboard') {
        return (
            <div className={`p-6 ${className}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse"
                        >
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'customer-list') {
        return (
            <div className={`p-6 ${className}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'ticket-list') {
        return (
            <div className={`h-full flex ${className}`}>
                <div className="w-1/2 border-r border-gray-200 p-6">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse"
                            >
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default loading state
    return (
        <div className={`h-full flex items-center justify-center p-6 ${className}`}>
            <div className="text-center">
                <ApperIcon name="Loader" className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
                <p className="text-gray-600">Please wait while we load the data.</p>
            </div>
        </div>
    );
};

export default LoadingState;