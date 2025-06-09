import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Select from '@/components/atoms/Select';
import MultiSelect from '@/components/atoms/MultiSelect';
import FileUpload from '@/components/atoms/FileUpload';
import SimilarTicketSuggestions from '@/components/atoms/SimilarTicketSuggestions';
import ticketService from '@/services/api/ticketService';
import customerService from '@/services/api/customerService';
import agentService from '@/services/api/agentService';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const tagOptions = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature-request', label: 'Feature Request' },
  { value: 'account', label: 'Account' },
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical' },
  { value: 'integration', label: 'Integration' },
  { value: 'performance', label: 'Performance' },
  { value: 'security', label: 'Security' },
  { value: 'ui-ux', label: 'UI/UX' },
  { value: 'documentation', label: 'Documentation' }
];

const NewTicketForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: '',
    tags: [],
    customerId: '',
    assigneeId: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [similarTickets, setSimilarTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      loadAgents();
    }
  }, [isOpen]);
// Debounced search for similar tickets
  const debouncedSearch = useCallback((query) => {
    const timer = setTimeout(async () => {
      if (query && query.length > 3) {
        setSuggestionsLoading(true);
        try {
          const similar = await ticketService.findSimilarTickets(query, formData.description);
          setSimilarTickets(similar.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to find similar tickets:', error);
          setSimilarTickets([]);
          setShowSuggestions(false);
        } finally {
          setSuggestionsLoading(false);
        }
      } else {
        setSimilarTickets([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [formData.description]);

  useEffect(() => {
    const cleanup = debouncedSearch(formData.subject);
    return cleanup;
}, [formData.subject, debouncedSearch]);

  useEffect(() => {
    const cleanup = debouncedSearch(formData.description);
    return cleanup;
  }, [formData.description, debouncedSearch]);

  const loadCustomers = async () => {
const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data.map(customer => ({
        value: customer.id,
        label: `${customer.name} (${customer.email})`
      })));
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };
  const loadAgents = async () => {
    try {
      const data = await agentService.getAll();
      setAgents(data.map(agent => ({
        value: agent.id,
        label: agent.name
      })));
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
};

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseTicketView = () => {
    setSelectedTicket(null);
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      const ticketData = {
        ...formData,
        attachments: formData.attachments.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url
        }))
      };

      const newTicket = await ticketService.create(ticketData);
      toast.success('Ticket created successfully!');
      
      // Reset form
      setFormData({
        subject: '',
        description: '',
        priority: '',
        tags: [],
        customerId: '',
        assigneeId: '',
        attachments: []
      });
      setErrors({});
      setSimilarTickets([]);
      setShowSuggestions(false);
      
      onSuccess(newTicket);
      onClose();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      subject: '',
      description: '',
      priority: '',
      tags: [],
      customerId: '',
      assigneeId: '',
      attachments: []
    });
    setErrors({});
    setSimilarTickets([]);
    setShowSuggestions(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </Button>
          </div>
<form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Subject"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    error={errors.subject}
                    placeholder="Brief description of the issue..."
                  />
                  
                  <SimilarTicketSuggestions
                    suggestions={similarTickets}
                    loading={suggestionsLoading}
                    show={showSuggestions}
                    onViewTicket={handleViewTicket}
                    onClose={handleCloseSuggestions}
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Description"
                    required
                    rows={4}
                    maxLength={2000}
                    showCount
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    error={errors.description}
                    placeholder="Detailed description of the issue..."
                  />
                </div>

                <div>
                  <Select
                    label="Priority"
                    required
                    value={formData.priority}
                    onChange={(value) => handleInputChange('priority', value)}
                    error={errors.priority}
                    placeholder="Select priority..."
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Select
                    label="Customer"
                    required
                    value={formData.customerId}
                    onChange={(value) => handleInputChange('customerId', value)}
                    error={errors.customerId}
                    placeholder="Select customer..."
                  >
                    {customers.map(customer => (
                      <option key={customer.value} value={customer.value}>
                        {customer.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <MultiSelect
                    label="Tags"
                    options={tagOptions}
                    value={formData.tags}
                    onChange={(value) => handleInputChange('tags', value)}
                    placeholder="Select tags..."
                    searchable
                  />
                </div>

                <div>
                  <Select
                    label="Assign to Agent"
                    value={formData.assigneeId}
                    onChange={(value) => handleInputChange('assigneeId', value)}
                    placeholder="Assign to agent (optional)..."
                  >
                    {agents.map(agent => (
                      <option key={agent.value} value={agent.value}>
                        {agent.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <FileUpload
                    label="Attachments"
                    value={formData.attachments}
                    onChange={(files) => handleInputChange('attachments', files)}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024} // 10MB
/>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
Create Ticket
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Selected Ticket View Modal */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onClick={handleCloseTicketView}
            >
              <div className="flex min-h-screen items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <ExternalLink size={20} className="text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Similar Ticket Details
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseTicketView}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Subject</h4>
                      <p className="text-gray-700">{selectedTicket.subject}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          selectedTicket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          selectedTicket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedTicket.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Priority</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedTicket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          selectedTicket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          selectedTicket.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedTicket.priority}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Created</h4>
                      <p className="text-gray-700">
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTicket.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end p-6 border-t border-gray-200">
                    <Button onClick={handleCloseTicketView}>
                      Close
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewTicketForm;