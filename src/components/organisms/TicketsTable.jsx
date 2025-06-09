import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import TableHeader from '@/components/molecules/TableHeader';
import ApperIcon from '@/components/ApperIcon';

const TicketsTable = ({
  tickets,
  customers,
  agents,
  onTicketSelect,
  selectedTicketId,
  onBulkAssign,
  onBulkStatusChange,
  className = ''
}) => {
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const columns = [
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'assignee', label: 'Assignee', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true }
  ];

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.name || 'Unassigned';
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const sortedTickets = useMemo(() => {
    const sorted = [...tickets].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle special sorting cases
      if (sortConfig.key === 'customer') {
        aValue = getCustomerName(a.customerId);
        bValue = getCustomerName(b.customerId);
      } else if (sortConfig.key === 'assignee') {
        aValue = getAgentName(a.assigneeId);
        bValue = getAgentName(b.assigneeId);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [tickets, sortConfig, customers, agents]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectTicket = (ticketId) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId);
    } else {
      newSelected.add(ticketId);
    }
    setSelectedTickets(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTickets.size === tickets.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(tickets.map(t => t.id)));
    }
  };

  const handleBulkAssign = (agentId) => {
    const ticketIds = Array.from(selectedTickets);
    onBulkAssign(ticketIds, agentId);
    setSelectedTickets(new Set());
  };

  const handleBulkStatusChange = (status) => {
    const ticketIds = Array.from(selectedTickets);
    onBulkStatusChange(ticketIds, status);
    setSelectedTickets(new Set());
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
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
            onSelectAll={handleSelectAll}
            selectedCount={selectedTickets.size}
            totalCount={tickets.length}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTickets.map((ticket, index) => (
              <motion.tr
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedTicketId === ticket.id ? 'bg-blue-50' : ''
                } ${selectedTickets.has(ticket.id) ? 'bg-blue-25' : ''}`}
              >
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedTickets.has(ticket.id)}
                    onChange={() => handleSelectTicket(ticket.id)}
                  />
                </td>
                
                <td className="px-4 py-4">
                  <div 
                    className="cursor-pointer"
                    onClick={() => onTicketSelect(ticket)}
                  >
                    <div className="font-medium text-gray-900 hover:text-primary transition-colors">
                      {ticket.subject}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {ticket.description}
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <Badge className={getStatusBadgeClass(ticket.status)}>
                    {formatStatus(ticket.status)}
                  </Badge>
                </td>
                
                <td className="px-4 py-4">
                  <Badge className={getPriorityBadgeClass(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {getCustomerName(ticket.customerId)}
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {getAgentName(ticket.assigneeId)}
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </div>
                </td>
                
                <td className="px-4 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTicketSelect(ticket)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pass bulk action handlers to parent */}
      {selectedTickets.size > 0 && (
        <div className="hidden">
          {/* This will be handled by BulkActionsBar in parent component */}
        </div>
      )}
    </div>
  );
};

export default TicketsTable;