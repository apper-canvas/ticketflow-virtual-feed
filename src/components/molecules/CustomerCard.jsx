import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';

const CustomerCard = ({ customer, totalTickets, openTickets, resolvedTickets, onClick, delay, className = '', ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
            onClick={onClick}
            className={`bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer ${className}`}
            {...props}
        >
            <div className="flex items-center mb-4">
                <Avatar src={customer.avatarUrl} alt={customer.name} className="mr-4" />
                <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                    <p className="text-sm text-gray-500 truncate">{customer.company}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-lg font-semibold text-gray-900">{totalTickets}</p>
                    <p className="text-xs text-gray-600">Total</p>
                </div>
                <div>
                    <p className="text-lg font-semibold text-status-open">{openTickets}</p>
                    <p className="text-xs text-gray-600">Open</p>
                </div>
                <div>
                    <p className="text-lg font-semibold text-success">{resolvedTickets}</p>
                    <p className="text-xs text-gray-600">Resolved</p>
                </div>
            </div>
        </motion.div>
    );
};

export default CustomerCard;