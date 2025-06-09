import React from 'react';
import NoteItem from '@/components/molecules/NoteItem';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const InternalNotesSection = ({ notes, agents, newNote, onNewNoteChange, onAddNote, addingNote, className = '', ...props }) => {
    const getAgentName = (agentId) => {
        const agent = agents.find(a => a.id === agentId);
        return agent?.name || 'Unknown Agent';
    };

    return (
        <div className={className} {...props}>
            <h3 className="font-medium text-gray-900 mb-4">Internal Notes</h3>

            {/* Add Note Form */}
            <div className="mb-4">
                <Input
                    type="textarea"
                    value={newNote}
                    onChange={onNewNoteChange}
                    placeholder="Add an internal note..."
                    rows={3}
                />
                <div className="flex justify-end mt-2">
                    <Button
                        onClick={onAddNote}
                        disabled={!newNote.trim() || addingNote}
                        className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {addingNote ? 'Adding...' : 'Add Note'}
                    </Button>
                </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3">
                {notes.map(note => (
                    <NoteItem key={note.id} note={note} authorName={getAgentName(note.authorId)} />
                ))}

                {notes.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No internal notes yet</p>
                )}
            </div>
        </div>
    );
};

export default InternalNotesSection;