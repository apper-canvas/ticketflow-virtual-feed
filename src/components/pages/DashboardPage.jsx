import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ticketService } from '@/services';
import DashboardMetricsGrid from '@/components/organisms/DashboardMetricsGrid';
import DashboardBreakdownSection from '@/components/organisms/DashboardBreakdownSection';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';

function DashboardPage() {
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
    const closed = tickets.filter(t => t.status === 'closed').length; // Added for completeness if needed
    const urgent = tickets.filter(t => t.priority === 'urgent').length;
    const high = tickets.filter(t => t.priority === 'high').length;
    const medium = tickets.filter(t => t.priority === 'medium').length;
    const low = tickets.filter(t => t.priority === 'low').length;
    
    const avgResponseTime = "2.4"; // Mock average
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      urgent,
      high,
      medium,
      low,
      avgResponseTime,
      resolutionRate
    };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return <LoadingState type="dashboard" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your support team's performance</p>
      </div>

      <DashboardMetricsGrid metrics={metrics} />
      <DashboardBreakdownSection metrics={metrics} />
    </div>
  );
}

export default DashboardPage;