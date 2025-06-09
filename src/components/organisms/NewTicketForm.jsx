import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Select from '@/components/atoms/Select';
import MultiSelect from '@/components/atoms/MultiSelect';
import FileUpload from '@/components/atoms/FileUpload';
import FormField from '@/components/molecules/FormField';
import SimilarTicketSuggestions from '@/components/atoms/SimilarTicketSuggestions';
import { ticketService } from '@/services/api/ticketService';
import { customerService } from '@/services/api/customerService';
import { agentService } from '@/services/api/agentService';
import { toast } from 'react-toastify';

const NewTicketForm = ({ onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    tags: [],
    customerId: '',
    assigneeId: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    'bug', 'feature-request', 'support', 'billing', 'technical', 'urgent'
  ]);
  const [similarTickets, setSimilarTickets] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-800' }
  ];

  // Load customers and agents on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersData, agentsData] = await Promise.all([
          customerService.getAllCustomers(),
          agentService.getAllAgents()
        ]);
        setCustomers(customersData.map(customer => ({
          value: customer.id,
          label: `${customer.name} (${customer.email})`
        })));
        setAgents(agentsData.map(agent => ({
          value: agent.id,
          label: `${agent.name} (${agent.email})`
        })));
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load customers and agents');
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Debounced search for similar tickets
  useEffect(() => {
    const searchSimilarTickets = async () => {
      if (!formData.subject.trim() && !formData.description.trim()) {
        setSimilarTickets([]);
        setShowSuggestions(false);
        return;
      }

      const query = `${formData.subject} ${formData.description}`.trim();
      if (query.length < 3) {
        setSimilarTickets([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const suggestions = await ticketService.findSimilarTickets(query);
        setSimilarTickets(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error('Error searching similar tickets:', error);
        setSimilarTickets([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchSimilarTickets, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.subject, formData.description]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (formData.subject.length > 100) {
      newErrors.subject = 'Subject must be less than 100 characters';
    }

    if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Handle file uploads
  const handleFileUpload = (files) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketData = {
        ...formData,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newTicket = await ticketService.createTicket(ticketData);
      toast.success('Ticket created successfully!');
      
      // Reset form
      setFormData({
        subject: '',
        description: '',
        priority: 'medium',
        tags: [],
        customerId: '',
        assigneeId: '',
        attachments: []
      });
      
      onSubmit(newTicket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle similar ticket click
  const handleSimilarTicketClick = (ticket) => {
    // In a real app, this would navigate to the ticket details
    toast.info(`Similar ticket: ${ticket.subject}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Create New Ticket</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Subject Field */}
              <div className="relative">
                <FormField
                  label="Subject"
                  required
                  error={errors.subject}
                >
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Brief description of the issue"
                    className={errors.subject ? 'border-red-500' : ''}
                  />
                </FormField>
                
                {/* Similar Tickets Suggestions */}
                {showSuggestions && (
                  <SimilarTicketSuggestions
                    tickets={similarTickets}
                    isLoading={isLoadingSuggestions}
                    onTicketClick={handleSimilarTicketClick}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Description Field */}
              <FormField
                label="Description"
                required
                error={errors.description}
              >
                <TextArea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the issue"
                  rows={6}
                  className={errors.description ? 'border-red-500' : ''}
                />
              </FormField>

              {/* File Upload */}
              <FormField label="Attachments">
                <FileUpload
                  onFilesSelected={handleFileUpload}
                  acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt']}
                  maxSize={10} // 10MB
                />
                
                {/* Display uploaded files */}
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FormField>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Customer Selection */}
              <FormField
                label="Customer"
                required
                error={errors.customerId}
              >
                <Select
                  value={formData.customerId}
                  onChange={(value) => handleInputChange('customerId', value)}
                  options={customers}
                  placeholder="Select a customer"
                  className={errors.customerId ? 'border-red-500' : ''}
                />
              </FormField>

              {/* Priority Selection */}
              <FormField label="Priority">
                <Select
                  value={formData.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                  options={priorityOptions}
                />
              </FormField>

              {/* Assignee Selection */}
              <FormField label="Assign to Agent">
                <Select
                  value={formData.assigneeId}
                  onChange={(value) => handleInputChange('assigneeId', value)}
                  options={agents}
                  placeholder="Assign to an agent (optional)"
                />
              </FormField>

              {/* Tags Selection */}
              <FormField label="Tags">
                <MultiSelect
                  selectedOptions={formData.tags}
                  onChange={(tags) => handleInputChange('tags', tags)}
                  options={availableTags.map(tag => ({ value: tag, label: tag }))}
                  placeholder="Add tags to categorize the ticket"
                />
              </FormField>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketForm;