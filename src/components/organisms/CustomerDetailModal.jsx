import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';

const CustomerDetailModal = ({ customer, tickets, onClose, className = '', ...props }) => {
    if (!customer) return null;

    const getCustomerTickets = (customerId) => {
        return tickets.filter(ticket => ticket.customerId === customerId);
    };

    const customerTickets = getCustomerTickets(customer.id);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'open': return 'bg-status-open text-white';
            case 'in-progress': return 'bg-status-in-progress text-white';
            case 'resolved': return 'bg-success text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${className}`} {...props}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar src={customer.avatarUrl} alt={customer.name} className="w-16 h-16 mr-4" />
                            <div>
                                <h2 className="text-xl font-heading font-semibold text-gray-900">
                                    {customer.name}
                                </h2>
                                <p className="text-gray-600">{customer.email}</p>
                                <p className="text-gray-500">{customer.company}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ApperIcon name="X" size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-96">
                    <h3 className="font-medium text-gray-900 mb-4">Ticket History</h3>

                    {customerTickets.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No tickets found for this customer</p>
                    ) : (
                        <div className="space-y-3">
                            {customerTickets.map(ticket => (
                                <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                                        <Badge className={getStatusBadgeClass(ticket.status)}>
                                            {ticket.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Priority: {ticket.priority}</span>
                                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerDetailModal;