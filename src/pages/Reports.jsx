import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { ticketService, agentService } from '../services';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, format } from 'date-fns';

function Reports() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketsData, agentsData] = await Promise.all([
        ticketService.getAll(),
        agentService.getAll()
      ]);
      setTickets(ticketsData);
      setAgents(agentsData);
    } catch (err) {
      setError(err.message || 'Failed to load reports data');
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeData = () => {
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case '7days':
        startDate = subDays(now, 7);
        endDate = now;
        break;
      case '30days':
        startDate = subDays(now, 30);
        endDate = now;
        break;
      default:
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
    }

    return { startDate, endDate };
  };

  const generateReports = () => {
    const { startDate, endDate } = getDateRangeData();
    
    // Filter tickets within date range
    const filteredTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate >= startDate && ticketDate <= endDate;
    });

    // Performance by agent
    const agentPerformance = agents.map(agent => {
      const agentTickets = filteredTickets.filter(t => t.assigneeId === agent.id);
      const resolvedTickets = agentTickets.filter(t => t.status === 'resolved');
      
      return {
        ...agent,
        totalTickets: agentTickets.length,
        resolvedTickets: resolvedTickets.length,
        resolutionRate: agentTickets.length > 0 ? Math.round((resolvedTickets.length / agentTickets.length) * 100) : 0
      };
    });

    // Ticket trends
    const statusBreakdown = {
      open: filteredTickets.filter(t => t.status === 'open').length,
      inProgress: filteredTickets.filter(t => t.status === 'in-progress').length,
      resolved: filteredTickets.filter(t => t.status === 'resolved').length,
      closed: filteredTickets.filter(t => t.status === 'closed').length
    };

    const priorityBreakdown = {
      low: filteredTickets.filter(t => t.priority === 'low').length,
      medium: filteredTickets.filter(t => t.priority === 'medium').length,
      high: filteredTickets.filter(t => t.priority === 'high').length,
      urgent: filteredTickets.filter(t => t.priority === 'urgent').length
    };

    return {
      totalTickets: filteredTickets.length,
      agentPerformance,
      statusBreakdown,
      priorityBreakdown,
      averageResolutionTime: '2.4 hours', // Mock data
      customerSatisfaction: '4.2/5' // Mock data
    };
  };

  const reports = generateReports();

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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Reports</h3>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">Analytics and insights for your support team</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reports.totalTickets}</p>
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
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reports.averageResolutionTime}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <ApperIcon name="Clock" className="text-accent" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reports.customerSatisfaction}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="Heart" className="text-success" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Tickets</p>
              <p className="text-3xl font-bold text-success mt-2">{reports.statusBreakdown.resolved}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="CheckCircle" className="text-success" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-status-open rounded mr-3"></div>
                <span className="text-sm text-gray-700">Open</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reports.statusBreakdown.open}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-status-in-progress rounded mr-3"></div>
                <span className="text-sm text-gray-700">In Progress</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reports.statusBreakdown.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-status-resolved rounded mr-3"></div>
                <span className="text-sm text-gray-700">Resolved</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reports.statusBreakdown.resolved}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-status-closed rounded mr-3"></div>
                <span className="text-sm text-gray-700">Closed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reports.statusBreakdown.closed}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-priority-urgent rounded mr-3"></div>
                <span className="text-sm text-gray-700">Urgent</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reports.priorityBreakdown.urgent}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-priority-high rounded mr-3"></div>
                <span className="text-sm text-gray-700">High</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reports.priorityBreakdown.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-priority-medium rounded mr-3"></div>
                <span className="text-sm text-gray-700">Medium</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reports.priorityBreakdown.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-priority-low rounded mr-3"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{reports.priorityBreakdown.low}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Agent Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-lg border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Agent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total Tickets</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Resolved</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {reports.agentPerformance.map(agent => (
                <tr key={agent.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={agent.avatarUrl}
                        alt={agent.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-sm text-gray-600">{agent.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{agent.totalTickets}</td>
                  <td className="py-3 px-4 text-gray-900">{agent.resolvedTickets}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      agent.resolutionRate >= 80 ? 'bg-success/10 text-success' :
                      agent.resolutionRate >= 60 ? 'bg-warning/10 text-warning' :
                      'bg-error/10 text-error'
                    }`}>
                      {agent.resolutionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default Reports;