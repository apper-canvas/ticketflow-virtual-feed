import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Avatar from '@/components/atoms/Avatar';

const AgentPerformanceTable = ({ agentPerformance, className = '', ...props }) => {
    return (
        <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={className}
            {...props}
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
                        {agentPerformance.map((agent) => (
                            <tr key={agent.id} className="border-b border-gray-100">
                                <td className="py-3 px-4">
                                    <div className="flex items-center">
                                        <Avatar src={agent.avatarUrl} alt={agent.name} className="w-8 h-8 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">{agent.name}</p>
                                            <p className="text-sm text-gray-600">{agent.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-900">{agent.totalTickets}</td>
                                <td className="py-3 px-4 text-gray-900">{agent.resolvedTickets}</td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            agent.resolutionRate >= 80
                                                ? 'bg-success/10 text-success'
                                                : agent.resolutionRate >= 60
                                                ? 'bg-warning/10 text-warning'
                                                : 'bg-error/10 text-error'
                                        }`}
                                    >
                                        {agent.resolutionRate}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default AgentPerformanceTable;