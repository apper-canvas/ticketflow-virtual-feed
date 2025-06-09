import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Badge from '@/components/atoms/Badge';

const TicketListItem = ({
    ticket,
    customerName,
    agentName,
    priorityColorClass,
    statusBorderClass,
    onClick,
    isSelected,
    delay,
    className = '',
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
            onClick={onClick}
            className={`p-4 bg-white rounded-lg border-l-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${statusBorderClass} ${
                isSelected ? 'ring-2 ring-primary/20 bg-primary/5' : ''
            } ${className}`}
            {...props}
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate flex-1">{ticket.subject}</h3>
                <Badge className={`ml-2 ${priorityColorClass}`}>{ticket.priority}</Badge>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{customerName}</span>
                <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
            </div>

            <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">{agentName}</span>
                <div className="flex gap-1">
                    {ticket.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default TicketListItem;