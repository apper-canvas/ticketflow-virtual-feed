import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import InternalNotesSection from './InternalNotesSection';
import { formatDistanceToNow } from 'date-fns';

const TicketDetailView = ({
    ticket,
    customers,
    agents,
    notes,
    onStatusChange,
    onAssignTicket,
    newNote,
    onNewNoteChange,
    onAddNote,
    addingNote,
    className = '',
    ...props
}) => {
    if (!ticket) {
        return (
            <div className={`flex-1 flex items-center justify-center text-center p-8 ${className}`} {...props}>
                <div>
                    <ApperIcon name="MessageSquare" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a ticket</h3>
                    <p className="text-gray-600">Choose a ticket from the list to view details and manage it</p>
                </div>
            </div>
        );
    }

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        return customer?.name || 'Unknown Customer';
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

    const statusOptions = [
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' },
    ];

    const assigneeOptions = [
        { value: '', label: 'Unassigned' },
        ...agents.map(agent => ({ value: agent.id, label: agent.name })),
    ];

    return (
        <div className={`flex flex-col overflow-hidden bg-white ${className}`} {...props}>
            {/* Ticket Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-heading font-semibold text-gray-900">
                        {ticket.subject}
                    </h2>
                    <Badge className={getPriorityColorClass(ticket.priority)}>
                        {ticket.priority}
                    </Badge>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                    <Select
                        value={ticket.status}
                        onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                        options={statusOptions}
                    />

                    <Select
                        value={ticket.assigneeId || ''}
                        onChange={(e) => onAssignTicket(ticket.id, e.target.value)}
                        options={assigneeOptions}
                    />
                </div>

                <div className="text-sm text-gray-600">
                    <p><strong>Customer:</strong> {getCustomerName(ticket.customerId)}</p>
                    <p><strong>Created:</strong> {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</p>
                    <p><strong>Channel:</strong> {ticket.channel}</p>
                </div>
            </div>

            {/* Ticket Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Original Message</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{ticket.description}</p>
                    </div>
                </div>

                <InternalNotesSection
                    notes={notes}
                    agents={agents}
                    newNote={newNote}
                    onNewNoteChange={(e) => onNewNoteChange(e.target.value)}
                    onAddNote={onAddNote}
                    addingNote={addingNote}
                />
            </div>
        </div>
    );
};

export default TicketDetailView;