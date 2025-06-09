import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { ticketService } from '../services';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ticketsData = await ticketService.getAll();
      setTickets(ticketsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const urgent = tickets.filter(t => t.priority === 'urgent').length;
    
    const avgResponseTime = "2.4"; // Mock average
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    return {
      total,
      open,
      inProgress,
      resolved,
      urgent,
      avgResponseTime,
      resolutionRate
    };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
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
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your support team's performance</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="Ticket" className="text-primary" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-3xl font-bold text-status-open mt-2">{metrics.open}</p>
            </div>
            <div className="p-3 bg-status-open/10 rounded-lg">
              <ApperIcon name="AlertCircle" className="text-status-open" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-3xl font-bold text-success mt-2">{metrics.resolutionRate}%</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="CheckCircle" className="text-success" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.avgResponseTime}h</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <ApperIcon name="Clock" className="text-accent" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Status Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-status-open rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Open</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{metrics.open}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-status-in-progress rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">In Progress</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{metrics.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-status-resolved rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Resolved</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{metrics.resolved}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-priority-urgent rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Urgent</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{metrics.urgent}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-priority-high rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">High</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {tickets.filter(t => t.priority === 'high').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-priority-medium rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Medium</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {tickets.filter(t => t.priority === 'medium').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-priority-low rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {tickets.filter(t => t.priority === 'low').length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;