import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const NoteItem = ({ note, authorName, className = '', ...props }) => {
    return (
        <div className={`p-3 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`} {...props}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{authorName}</span>
                <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </span>
            </div>
            <p className="text-sm text-gray-700">{note.content}</p>
        </div>
    );
};

export default NoteItem;