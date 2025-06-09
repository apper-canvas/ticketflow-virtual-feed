import React from 'react';
import Select from '@/components/atoms/Select';

const TicketListFilters = ({ filters, onFilterChange, agents, className = '', ...props }) => {
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' },
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priority' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
    ];

    const assigneeOptions = [
        { value: 'all', label: 'All Assignees' },
        ...agents.map(agent => ({ value: agent.id, label: agent.name })),
        { value: '', label: 'Unassigned' },
    ];

    return (
        <div className={`p-6 border-b border-gray-200 bg-white ${className}`} {...props}>
            <div className="flex flex-wrap gap-4">
                <Select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    options={statusOptions}
                />
                <Select
                    value={filters.priority}
                    onChange={(e) => onFilterChange('priority', e.target.value)}
                    options={priorityOptions}
                />
                <Select
                    value={filters.assignee}
                    onChange={(e) => onFilterChange('assignee', e.target.value)}
                    options={assigneeOptions}
                />
            </div>
        </div>
    );
};

export default TicketListFilters;