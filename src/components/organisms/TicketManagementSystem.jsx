import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ticketService, customerService, agentService, internalNoteService } from '@/services';
import TicketListFilters from './TicketListFilters';
import TicketListView from './TicketListView';
import TicketDetailView from './TicketDetailView';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

function TicketManagementSystem() {
    const [tickets, setTickets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [internalNotes, setInternalNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        assignee: 'all',
    });
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

    const filteredTickets = tickets.filter((ticket) => {
        if (filters.status !== 'all' && ticket.status !== filters.status) return false;
        if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
        if (filters.assignee !== 'all' && ticket.assigneeId !== filters.assignee) return false;
        return true;
    });

    if (loading) {
        return <LoadingState type="ticket-list" />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadData} className="h-full flex items-center justify-center" />;
    }

    return (
        <div className="h-full flex max-w-full overflow-hidden">
            {/* Ticket List Section */}
            <div className="w-full lg:w-1/2 border-r border-gray-200 flex flex-col overflow-hidden">
                <TicketListFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    agents={agents}
                />
                <TicketListView
                    tickets={filteredTickets}
                    customers={customers}
                    agents={agents}
                    onTicketSelect={handleTicketSelect}
                    selectedTicketId={selectedTicket?.id}
                />
            </div>

            {/* Ticket Detail Section */}
            <AnimatePresence>
                <div className="hidden lg:block w-1/2 flex flex-col overflow-hidden bg-white">
                    <TicketDetailView
                        ticket={selectedTicket}
                        customers={customers}
                        agents={agents}
                        notes={internalNotes}
                        onStatusChange={handleStatusChange}
                        onAssignTicket={handleAssignTicket}
                        newNote={newNote}
                        onNewNoteChange={setNewNote}
                        onAddNote={handleAddNote}
                        addingNote={addingNote}
                    />
                </div>
            </AnimatePresence>
        </div>
    );
}

export default TicketManagementSystem;