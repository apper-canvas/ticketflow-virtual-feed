import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Lightbulb } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Select from '@/components/atoms/Select';
import MultiSelect from '@/components/atoms/MultiSelect';
import FileUpload from '@/components/atoms/FileUpload';
import Badge from '@/components/atoms/Badge';
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
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      loadAgents();
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-suggest similar tickets when subject changes
    const timer = setTimeout(() => {
      if (formData.subject.length > 3) {
        findSimilarTickets(formData.subject);
      } else {
        setSimilarTickets([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.subject]);

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

  const findSimilarTickets = async (subject) => {
    try {
      const similar = await ticketService.findSimilarTickets(subject);
      setSimilarTickets(similar.slice(0, 3)); // Show top 3 similar tickets
      setShowSuggestions(similar.length > 0);
    } catch (error) {
      console.error('Failed to find similar tickets:', error);
    }
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

              <AnimatePresence>
                {showSuggestions && similarTickets.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-amber-200 bg-amber-50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={16} className="text-amber-600" />
                      <h3 className="text-sm font-medium text-amber-800">
                        Similar Tickets Found
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {similarTickets.map(ticket => (
                        <div
                          key={ticket.id}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {ticket.subject}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={ticket.status === 'resolved' ? 'success' : 'secondary'}
                                size="sm"
                              >
                                {ticket.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {ticket.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-amber-700 mt-2">
                      Consider checking these tickets for existing solutions.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
      </div>
    </div>
  );
};

export default NewTicketForm;