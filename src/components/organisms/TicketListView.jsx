import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import TicketListItem from '@/components/molecules/TicketListItem';

const TicketListView = ({
    tickets,
    customers,
    agents,
    onTicketSelect,
    selectedTicketId,
    className = '',
    ...props
}) => {

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        return customer?.name || 'Unknown Customer';
    };

    const getAgentName = (agentId) => {
        const agent = agents.find(a => a.id === agentId);
        return agent?.name || 'Unassigned';
    };

    const getPriorityColorClass = (priority) => {
        const colors = {
            low: 'bg-priority-low text-white',
            medium: 'bg-priority-medium text-white',
            high: 'bg-priority-high text-white',
            urgent: 'bg-priority-urgent text-white'
        };
        return colors[priority] || 'bg-gray-500 text-white';
    };

    const getStatusBorderClass = (status) => {
        const colors = {
            open: 'border-l-status-open',
            'in-progress': 'border-l-status-in-progress',
            resolved: 'border-l-status-resolved',
            closed: 'border-l-status-closed'
        };
        return colors[status] || 'border-l-gray-400';
    };

    if (tickets.length === 0) {
        return (
            <div className="p-8 text-center">
                <ApperIcon name="Inbox" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later</p>
            </div>
        );
    }

    return (
        <div className={`flex-1 overflow-y-auto ${className}`} {...props}>
            <div className="p-4 space-y-2">
                {tickets.map((ticket, index) => (
                    <TicketListItem
                        key={ticket.id}
                        ticket={ticket}
                        customerName={getCustomerName(ticket.customerId)}
                        agentName={getAgentName(ticket.assigneeId)}
                        priorityColorClass={getPriorityColorClass(ticket.priority)}
                        statusBorderClass={getStatusBorderClass(ticket.status)}
                        onClick={() => onTicketSelect(ticket)}
                        isSelected={selectedTicketId === ticket.id}
                        delay={index * 0.05}
                    />
                ))}
            </div>
        </div>
    );
};

export default TicketListView;