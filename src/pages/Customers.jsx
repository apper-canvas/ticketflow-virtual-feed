import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { customerService, ticketService } from '../services';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [customersData, ticketsData] = await Promise.all([
        customerService.getAll(),
        ticketService.getAll()
      ]);
      setCustomers(customersData);
      setTickets(ticketsData);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerTickets = (customerId) => {
    return tickets.filter(ticket => ticket.customerId === customerId);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Customers</h3>
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
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">Manage customer information and ticket history</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={16} 
          />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Customer profiles will appear here when they submit tickets'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => {
            const customerTickets = getCustomerTickets(customer.id);
            const openTickets = customerTickets.filter(t => t.status === 'open').length;
            const resolvedTickets = customerTickets.filter(t => t.status === 'resolved').length;

            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={customer.avatarUrl}
                    alt={customer.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                    <p className="text-sm text-gray-500 truncate">{customer.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{customerTickets.length}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-status-open">{openTickets}</p>
                    <p className="text-xs text-gray-600">Open</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-success">{resolvedTickets}</p>
                    <p className="text-xs text-gray-600">Resolved</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={selectedCustomer.avatarUrl}
                    alt={selectedCustomer.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-heading font-semibold text-gray-900">
                      {selectedCustomer.name}
                    </h2>
                    <p className="text-gray-600">{selectedCustomer.email}</p>
                    <p className="text-gray-500">{selectedCustomer.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <h3 className="font-medium text-gray-900 mb-4">Ticket History</h3>
              
              {getCustomerTickets(selectedCustomer.id).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tickets found for this customer</p>
              ) : (
                <div className="space-y-3">
                  {getCustomerTickets(selectedCustomer.id).map(ticket => (
                    <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ticket.status === 'open' ? 'bg-status-open text-white' :
                          ticket.status === 'in-progress' ? 'bg-status-in-progress text-white' :
                          ticket.status === 'resolved' ? 'bg-success text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {ticket.status}
                        </span>
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
      )}
    </div>
  );
}

export default Customers;