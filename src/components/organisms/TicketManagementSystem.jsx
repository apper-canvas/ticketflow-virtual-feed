import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Users, Clock, CheckCircle2, AlertTriangle, Plus, LayoutGrid, List } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import TicketListFilters from './TicketListFilters';
import TicketListView from './TicketListView';
import TicketsTable from './TicketsTable';
import TicketDetailView from './TicketDetailView';
import NewTicketForm from './NewTicketForm';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import BulkActionsBar from './BulkActionsBar';
import ticketService from '@/services/ticketService';
import customerService from '@/services/customerService';
import agentService from '@/services/agentService';
import internalNoteService from '@/services/internalNoteService';

function TicketManagementSystem() {
const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all'
  });
  const [viewMode, setViewMode] = useState('table');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [internalNotes, setInternalNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [ticketsData, customersData, agentsData] = await Promise.all([
                ticketService.getAll(),
                customerService.getAll(),
                agentService.getAll(),
            ]);
            setTickets(ticketsData);
            setCustomers(customersData);
            setAgents(agentsData);
        } catch (err) {
            setError(err.message || 'Failed to load data');
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadTicketNotes = async (ticketId) => {
        try {
            const notes = await internalNoteService.getByTicketId(ticketId);
            setInternalNotes(notes);
        } catch (err) {
            toast.error('Failed to load internal notes');
        }
    };

    const handleTicketSelect = (ticket) => {
        setSelectedTicket(ticket);
        loadTicketNotes(ticket.id);
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const updatedTicket = await ticketService.update(ticketId, { status: newStatus });
            setTickets(tickets.map((t) => (t.id === ticketId ? updatedTicket : t)));
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(updatedTicket);
            }
            toast.success(`Ticket status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update ticket status');
        }
    };

    const handleAssignTicket = async (ticketId, assigneeId) => {
        try {
            const updatedTicket = await ticketService.update(ticketId, { assigneeId });
            setTickets(tickets.map((t) => (t.id === ticketId ? updatedTicket : t)));
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(updatedTicket);
            }
            const agent = agents.find((a) => a.id === assigneeId);
            toast.success(`Ticket assigned to ${agent?.name || 'agent'}`);
        } catch (err) {
            toast.error('Failed to assign ticket');
        }
    };

const handleAddNote = async () => {
        if (!newNote.trim() || !selectedTicket) return;

        setAddingNote(true);
        try {
            const noteData = {
                ticketId: selectedTicket.id,
                authorId: '1', // Current user
                content: newNote.trim(),
            };

            const createdNote = await internalNoteService.create(noteData);
            setInternalNotes([createdNote, ...internalNotes]);
            setNewNote('');
            toast.success('Internal note added');
        } catch (err) {
            toast.error('Failed to add note');
        } finally {
            setAddingNote(false);
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setSelectedTickets(new Set());
    };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setSelectedTicket(updatedTicket);
  };

  const handleNewTicketSuccess = (newTicket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
    setSelectedTicket(newTicket);
};

  const handleBulkAssign = async (ticketIds, agentId) => {
    try {
      await ticketService.bulkUpdate(ticketIds, { assigneeId: agentId });
      const updatedTickets = tickets.map(ticket => 
        ticketIds.includes(ticket.id) 
          ? { ...ticket, assigneeId: agentId, updatedAt: new Date().toISOString() }
          : ticket
      );
      setTickets(updatedTickets);
      
      const agent = agents.find(a => a.id === agentId);
      toast.success(`${ticketIds.length} ticket${ticketIds.length !== 1 ? 's' : ''} assigned to ${agent?.name || 'agent'}`);
    } catch (err) {
      toast.error('Failed to assign tickets');
    }
  };

    const handleBulkStatusChange = async (ticketIds, status) => {
        try {
            await ticketService.bulkUpdate(ticketIds, { status });
            const updatedTickets = tickets.map(ticket => 
                ticketIds.includes(ticket.id) 
                    ? { ...ticket, status, updatedAt: new Date().toISOString() }
                    : ticket
            );
            setTickets(updatedTickets);
            
            toast.success(`${ticketIds.length} ticket${ticketIds.length !== 1 ? 's' : ''} status updated to ${status}`);
        } catch (err) {
            toast.error('Failed to update ticket status');
        }
    };

const filteredTickets = useMemo(() => {
        return tickets.filter((ticket) => {
            // Status filter
            if (filters.status !== 'all' && ticket.status !== filters.status) {
                return false;
            }
            
            // Priority filter
            if (filters.priority !== 'all' && ticket.priority !== filters.priority) {
                return false;
            }
            
            // Assignee filter
            if (filters.assignee !== 'all' && ticket.assigneeId !== filters.assignee) {
                return false;
            }
            
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const customer = customers.find(c => c.id === ticket.customerId);
                const agent = agents.find(a => a.id === ticket.assigneeId);
                
                return (
                    ticket.subject.toLowerCase().includes(query) ||
                    ticket.description.toLowerCase().includes(query) ||
                    customer?.name.toLowerCase().includes(query) ||
                    agent?.name.toLowerCase().includes(query) ||
                    ticket.tags?.some(tag => tag.toLowerCase().includes(query))
                );
            }
            
            return true;
        });
    }, [tickets, filters, searchQuery, customers, agents]);

    if (loading) {
        return <LoadingState type="ticket-list" />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadData} className="h-full flex items-center justify-center" />;
    }

return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col max-w-full overflow-hidden relative"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Total:</span>
                        <Badge variant="secondary">{filteredTickets.length}</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setShowNewTicketForm(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New Ticket
                    </Button>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <BulkActionsBar
                selectedCount={selectedTickets.size}
                onAssignTickets={handleBulkAssign}
                onChangeStatus={handleBulkStatusChange}
                onClearSelection={() => setSelectedTickets(new Set())}
                agents={agents}
                visible={selectedTickets.size > 0}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Section */}
                <div className="w-full lg:w-1/2 border-r border-gray-200 flex flex-col overflow-hidden">
                    <TicketListFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        agents={agents}
                        onSearchChange={handleSearchChange}
                        searchQuery={searchQuery}
                        onViewModeChange={handleViewModeChange}
                        viewMode={viewMode}
                    />
                    
                    <div className="flex-1 overflow-hidden">
                        {viewMode === 'table' ? (
                            <div className="h-full overflow-auto p-4">
                                <TicketsTable
                                    tickets={filteredTickets}
                                    customers={customers}
                                    agents={agents}
                                    onTicketSelect={handleTicketSelect}
                                    selectedTicketId={selectedTicket?.id}
                                    onBulkAssign={handleBulkAssign}
                                    onBulkStatusChange={handleBulkStatusChange}
                                />
                            </div>
                        ) : (
                            <TicketListView
                                tickets={filteredTickets}
                                customers={customers}
                                agents={agents}
                                onTicketSelect={handleTicketSelect}
                                selectedTicketId={selectedTicket?.id}
                            />
                        )}
                    </div>
                </div>

                {/* Ticket Detail Section */}
                <AnimatePresence>
                    <div className="hidden lg:block w-1/2 flex flex-col overflow-hidden bg-white">
                        <TicketDetailView
                            ticket={selectedTicket}
                            customers={customers}
                            agents={agents}
                            onTicketUpdate={handleTicketUpdate}
                            onStatusChange={handleStatusChange}
                            onAssignTicket={handleAssignTicket}
                            internalNotes={internalNotes}
                            onAddNote={handleAddNote}
                            newNote={newNote}
                            setNewNote={setNewNote}
                            addingNote={addingNote}
                        />
                    </div>
                </AnimatePresence>
            </div>

            <NewTicketForm
                isOpen={showNewTicketForm}
                onClose={() => setShowNewTicketForm(false)}
                onSuccess={handleNewTicketSuccess}
                customers={customers}
                agents={agents}
            />
        </motion.div>
    );
}

export default TicketManagementSystem;