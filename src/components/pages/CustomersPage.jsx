import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { customerService, ticketService } from '@/services';
import CustomerSearch from '@/components/organisms/CustomerSearch';
import CustomerGrid from '@/components/organisms/CustomerGrid';
import CustomerDetailModal from '@/components/organisms/CustomerDetailModal';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';

function CustomersPage() {
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingState type="customer-list" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">Manage customer information and ticket history</p>
      </div>

      <CustomerSearch searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      {filteredCustomers.length === 0 && searchTerm ? (
        <div className="text-center py-12">
            <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : (
        <CustomerGrid 
            customers={filteredCustomers} 
            tickets={tickets} 
            onSelectCustomer={setSelectedCustomer} 
        />
      )}
      

      <CustomerDetailModal
        customer={selectedCustomer}
        tickets={tickets}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}

export default CustomersPage;