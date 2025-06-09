import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Select from '@/components/atoms/Select';
import MetricCard from '@/components/molecules/MetricCard';
import StatusIndicator from '@/components/molecules/StatusIndicator';
import AgentPerformanceTable from '@/components/organisms/AgentPerformanceTable';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import { ticketService, agentService } from '@/services';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

function ReportsPage() {
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
    return <LoadingState type="dashboard" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  const dateRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
  ];

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">Analytics and insights for your support team</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={dateRangeOptions}
            />
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Tickets"
          value={reports.totalTickets}
          iconName="Ticket"
          iconColorClass="text-primary"
          bgColorClass="bg-primary/10"
          delay={0.1}
        />

        <MetricCard
          title="Avg Resolution Time"
          value={reports.averageResolutionTime}
          iconName="Clock"
          iconColorClass="text-accent"
          bgColorClass="bg-accent/10"
          delay={0.2}
        />

        <MetricCard
          title="Customer Satisfaction"
          value={reports.customerSatisfaction}
          iconName="Heart"
          iconColorClass="text-success"
          bgColorClass="bg-success/10"
          delay={0.3}
        />

        <MetricCard
          title="Resolved Tickets"
          value={reports.statusBreakdown.resolved}
          iconName="CheckCircle"
          iconColorClass="text-success"
          bgColorClass="bg-success/10"
          delay={0.4}
        />
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
            <StatusIndicator label="Open" count={reports.statusBreakdown.open} colorClass="bg-status-open" shape="square" />
            <StatusIndicator label="In Progress" count={reports.statusBreakdown.inProgress} colorClass="bg-status-in-progress" shape="square" />
            <StatusIndicator label="Resolved" count={reports.statusBreakdown.resolved} colorClass="bg-status-resolved" shape="square" />
            <StatusIndicator label="Closed" count={reports.statusBreakdown.closed} colorClass="bg-status-closed" shape="square" />
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
            <StatusIndicator label="Urgent" count={reports.priorityBreakdown.urgent} colorClass="bg-priority-urgent" shape="square" />
            <StatusIndicator label="High" count={reports.priorityBreakdown.high} colorClass="bg-priority-high" shape="square" />
            <StatusIndicator label="Medium" count={reports.priorityBreakdown.medium} colorClass="bg-priority-medium" shape="square" />
            <StatusIndicator label="Low" count={reports.priorityBreakdown.low} colorClass="bg-priority-low" shape="square" />
          </div>
        </motion.div>
      </div>

      <AgentPerformanceTable agentPerformance={reports.agentPerformance} />
    </div>
  );
}

export default ReportsPage;