import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ExternalLink, Clock, User } from 'lucide-react';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const SimilarTicketSuggestions = ({ 
  suggestions, 
  loading, 
  onViewTicket, 
  onClose,
  show 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (e) => {
    if (!show || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onViewTicket(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  React.useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [show, suggestions, selectedIndex]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="border border-amber-200 bg-amber-50 rounded-lg p-4 mt-2"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-600" />
            <h3 className="text-sm font-medium text-amber-800">
              Similar Tickets Found
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-amber-600 hover:text-amber-700 text-xs"
          >
            Hide
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            <span className="ml-2 text-sm text-amber-700">Searching...</span>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-2">
            {suggestions.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center justify-between p-3 bg-white rounded border transition-all cursor-pointer
                  ${selectedIndex === index 
                    ? 'border-amber-300 shadow-sm bg-amber-25' 
                    : 'hover:border-amber-200 hover:shadow-sm'
                  }
                `}
                onClick={() => onViewTicket(ticket)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ticket.subject}
                    </p>
                    <ExternalLink size={14} className="text-amber-600 flex-shrink-0" />
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <Badge
                      variant={
                        ticket.status === 'resolved' ? 'success' :
                        ticket.status === 'in-progress' ? 'warning' :
                        ticket.status === 'closed' ? 'secondary' : 'info'
                      }
                      size="sm"
                    >
                      {ticket.status}
                    </Badge>
                    
                    <Badge
                      variant={
                        ticket.priority === 'urgent' ? 'error' :
                        ticket.priority === 'high' ? 'warning' :
                        ticket.priority === 'medium' ? 'info' : 'secondary'
                      }
                      size="sm"
                    >
                      {ticket.priority}
                    </Badge>
                    
                    {ticket.assigneeName && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User size={12} />
                        <span>{ticket.assigneeName}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-amber-700">No similar tickets found</p>
            <p className="text-xs text-amber-600 mt-1">
              This appears to be a unique issue
            </p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-200">
            <p className="text-xs text-amber-700">
              💡 Consider checking these tickets for existing solutions or similar resolutions.
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Use ↑↓ arrows to navigate, Enter to view, Esc to close
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SimilarTicketSuggestions;