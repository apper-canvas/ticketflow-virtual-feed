import React from 'react';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TicketListFilters = ({ 
  filters, 
  onFilterChange, 
  agents, 
  onSearchChange,
  searchQuery = '',
  onViewModeChange,
  viewMode = 'list',
  className = '' 
}) => {
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priority' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

const assigneeOptions = [
        { value: 'all', label: 'All Agents' },
        { value: 'unassigned', label: 'Unassigned' },
        ...(agents || []).map(agent => ({
            value: agent.id,
            label: agent.name
        }))
    ];

    const clearFilters = () => {
        onFilterChange('status', 'all');
        onFilterChange('priority', 'all');
        onFilterChange('assignee', 'all');
        if (onSearchChange) {
            onSearchChange('');
        }
    };

    const hasActiveFilters = filters.status !== 'all' || 
                           filters.priority !== 'all' || 
                           filters.assignee !== 'all' ||
                           searchQuery !== '';

    return (
        <div className={`bg-white p-4 border-b border-gray-200 space-y-4 ${className}`}>
            {/* Search and View Mode */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                
                {onViewModeChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">View:</span>
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                            <Button
                                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => onViewModeChange('list')}
                                className="rounded-none border-0"
                            >
                                <ApperIcon name="List" className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'table' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => onViewModeChange('table')}
                                className="rounded-none border-0 border-l border-gray-200"
                            >
                                <ApperIcon name="Table" className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <ApperIcon name="Filter" className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>

                <Select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    options={statusOptions}
                    className="min-w-32"
                />

                <Select
                    value={filters.priority}
                    onChange={(e) => onFilterChange('priority', e.target.value)}
                    options={priorityOptions}
                    className="min-w-32"
                />

                <Select
                    value={filters.assignee}
                    onChange={(e) => onFilterChange('assignee', e.target.value)}
                    options={assigneeOptions}
                    className="min-w-32"
                />

                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="flex items-center gap-2"
                    >
                        <ApperIcon name="X" className="w-4 h-4" />
                        Clear
</Button>
                )}
            </div>
        </div>
    );
};

export default TicketListFilters;