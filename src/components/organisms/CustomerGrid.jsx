import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import CustomerCard from '@/components/molecules/CustomerCard';

const CustomerGrid = ({ customers, tickets, onSelectCustomer, className = '', ...props }) => {
    if (customers.length === 0) {
        return (
            <div className="text-center py-12">
                <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers yet</h3>
                <p className="text-gray-600">
                    Customer profiles will appear here when they submit tickets
                </p>
            </div>
        );
    }

    const getCustomerTickets = (customerId) => {
        return tickets.filter(ticket => ticket.customerId === customerId);
    };

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`} {...props}>
            {customers.map((customer, index) => {
                const customerTickets = getCustomerTickets(customer.id);
                const openTickets = customerTickets.filter(t => t.status === 'open').length;
                const resolvedTickets = customerTickets.filter(t => t.status === 'resolved').length;

                return (
                    <CustomerCard
                        key={customer.id}
                        customer={customer}
                        totalTickets={customerTickets.length}
                        openTickets={openTickets}
                        resolvedTickets={resolvedTickets}
                        onClick={() => onSelectCustomer(customer)}
                        delay={index * 0.05}
                    />
                );
            })}
        </div>
    );
};

export default CustomerGrid;