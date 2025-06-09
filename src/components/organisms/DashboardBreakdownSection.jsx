import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import StatusIndicator from '@/components/molecules/StatusIndicator';

const DashboardBreakdownSection = ({ metrics, className = '', ...props }) => {
    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`} {...props}>
            <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Status Breakdown</h3>
                <div className="space-y-4">
                    <StatusIndicator label="Open" count={metrics.open} colorClass="bg-status-open" />
                    <StatusIndicator label="In Progress" count={metrics.inProgress} colorClass="bg-status-in-progress" />
                    <StatusIndicator label="Resolved" count={metrics.resolved} colorClass="bg-status-resolved" />
                </div>
            </Card>

            <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
                <div className="space-y-4">
                    <StatusIndicator label="Urgent" count={metrics.urgent} colorClass="bg-priority-urgent" />
                    <StatusIndicator label="High" count={metrics.high} colorClass="bg-priority-high" />
                    <StatusIndicator label="Medium" count={metrics.medium} colorClass="bg-priority-medium" />
                    <StatusIndicator label="Low" count={metrics.low} colorClass="bg-priority-low" />
                </div>
            </Card>
        </div>
    );
};

export default DashboardBreakdownSection;