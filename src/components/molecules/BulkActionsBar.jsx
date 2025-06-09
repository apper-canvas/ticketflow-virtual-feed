import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const BulkActionsBar = ({
  selectedCount,
  onAssignTickets,
  onChangeStatus,
  onClearSelection,
  agents = [],
  visible = false
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const agentOptions = [
    { value: '', label: 'Select an agent...' },
    ...agents.map(agent => ({
      value: agent.id,
      label: agent.name
    }))
  ];

  const handleAssign = () => {
    if (!selectedAgent) {
      toast.error('Please select an agent');
      return;
    }
    onAssignTickets(selectedAgent);
    setShowAssignModal(false);
    setSelectedAgent('');
  };

  const handleStatusChange = () => {
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }
    onChangeStatus(selectedStatus);
    setShowStatusModal(false);
    setSelectedStatus('');
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg border border-gray-200 rounded-lg px-6 py-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {selectedCount} ticket{selectedCount !== 1 ? 's' : ''} selected
              </span>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssignModal(true)}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="User" className="w-4 h-4" />
                  Assign
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStatusModal(true)}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="RefreshCw" className="w-4 h-4" />
                  Change Status
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Assign {selectedCount} ticket{selectedCount !== 1 ? 's' : ''}
              </h3>
              
              <div className="mb-6">
                <Select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  options={agentOptions}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAssign}>
                  Assign Tickets
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Change Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change status for {selectedCount} ticket{selectedCount !== 1 ? 's' : ''}
              </h3>
              
              <div className="mb-6">
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  options={[
                    { value: '', label: 'Select new status...' },
                    ...statusOptions
                  ]}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleStatusChange}>
                  Update Status
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BulkActionsBar;