import { delay } from '../index';
import internalNotesData from '../mockData/internalNotes.json';

class InternalNoteService {
  constructor() {
    this.notes = [...internalNotesData];
  }

  async getAll() {
    await delay(200);
    return [...this.notes];
  }

  async getByTicketId(ticketId) {
    await delay(200);
    return this.notes.filter(note => note.ticketId === ticketId);
  }

  async create(noteData) {
    await delay(300);
    const newNote = {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date().toISOString()
    };
    this.notes.unshift(newNote);
    return { ...newNote };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error('Note not found');
    }
    
    this.notes[index] = {
      ...this.notes[index],
      ...updates
    };
    
    return { ...this.notes[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error('Note not found');
    }
    
    this.notes.splice(index, 1);
    return { success: true };
  }
}

export default new InternalNoteService();