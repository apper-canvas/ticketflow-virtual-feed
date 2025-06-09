import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';

const DashboardMetricsGrid = ({ metrics, className = '', ...props }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${className}`} {...props}>
            <MetricCard
                title="Total Tickets"
                value={metrics.total}
                iconName="Ticket"
                iconColorClass="text-primary"
                bgColorClass="bg-primary/10"
                delay={0.1}
            />
            <MetricCard
                title="Open Tickets"
                value={metrics.open}
                iconName="AlertCircle"
                iconColorClass="text-status-open"
                bgColorClass="bg-status-open/10"
                delay={0.2}
            />
            <MetricCard
                title="Resolution Rate"
                value={`${metrics.resolutionRate}%`}
                iconName="CheckCircle"
                iconColorClass="text-success"
                bgColorClass="bg-success/10"
                delay={0.3}
            />
            <MetricCard
                title="Avg Response Time"
                value={`${metrics.avgResponseTime}h`}
                iconName="Clock"
                iconColorClass="text-accent"
                bgColorClass="bg-accent/10"
                delay={0.4}
            />
        </div>
    );
};

export default DashboardMetricsGrid;