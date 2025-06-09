import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { ticketService, customerService, agentService, internalNoteService } from '../services';
import { formatDistanceToNow } from 'date-fns';

function MainFeature() {
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
    assignee: 'all'
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
        agentService.getAll()
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
      setTickets(tickets.map(t => t.id === ticketId ? updatedTicket : t));
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
      setTickets(tickets.map(t => t.id === ticketId ? updatedTicket : t));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
      const agent = agents.find(a => a.id === assigneeId);
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
        authorId: "1", // Current user
        content: newNote.trim()
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

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.name || 'Unassigned';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-priority-low text-white',
      medium: 'bg-priority-medium text-white', 
      high: 'bg-priority-high text-white',
      urgent: 'bg-priority-urgent text-white'
    };
    return colors[priority] || 'bg-gray-500 text-white';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'border-l-status-open',
      'in-progress': 'border-l-status-in-progress',
      resolved: 'border-l-status-resolved',
      closed: 'border-l-status-closed'
    };
    return colors[status] || 'border-l-gray-400';
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
    if (filters.assignee !== 'all' && ticket.assigneeId !== filters.assignee) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="h-full flex">
        <div className="w-1/2 border-r border-gray-200 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="w-1/2 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Tickets</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex max-w-full overflow-hidden">
      {/* Ticket List */}
      <div className="w-full lg:w-1/2 border-r border-gray-200 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={filters.assignee}
              onChange={(e) => setFilters({...filters, assignee: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="all">All Assignees</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
              <option value="">Unassigned</option>
            </select>
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center">
              <ApperIcon name="Inbox" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleTicketSelect(ticket)}
                  className={`p-4 bg-white rounded-lg border-l-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
                    getStatusColor(ticket.status)
                  } ${selectedTicket?.id === ticket.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate flex-1">{ticket.subject}</h3>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{getCustomerName(ticket.customerId)}</span>
                    <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">
                      {ticket.assigneeId ? getAgentName(ticket.assigneeId) : 'Unassigned'}
                    </span>
                    <div className="flex gap-1">
                      {ticket.tags?.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail */}
      <div className="hidden lg:block w-1/2 flex flex-col overflow-hidden bg-white">
        {selectedTicket ? (
          <>
            {/* Ticket Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-heading font-semibold text-gray-900">
                  {selectedTicket.subject}
                </h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                  {selectedTicket.priority}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={selectedTicket.assigneeId || ''}
                  onChange={(e) => handleAssignTicket(selectedTicket.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="">Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>Customer:</strong> {getCustomerName(selectedTicket.customerId)}</p>
                <p><strong>Created:</strong> {formatDistanceToNow(new Date(selectedTicket.createdAt), { addSuffix: true })}</p>
                <p><strong>Channel:</strong> {selectedTicket.channel}</p>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Original Message</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Internal Notes</h3>
                
                {/* Add Note Form */}
                <div className="mb-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || addingNote}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {addingNote ? 'Adding...' : 'Add Note'}
                    </button>
                  </div>
                </div>

                {/* Notes List */}
                <div className="space-y-3">
                  {internalNotes.map(note => {
                    const author = agents.find(a => a.id === note.authorId);
                    return (
                      <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {author?.name || 'Unknown Agent'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{note.content}</p>
                      </div>
                    );
                  })}
                  
                  {internalNotes.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No internal notes yet</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <ApperIcon name="MessageSquare" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a ticket</h3>
              <p className="text-gray-600">Choose a ticket from the list to view details and manage it</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainFeature;