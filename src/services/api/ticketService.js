import { delay } from '../index';
import ticketsData from '../mockData/tickets.json';

class TicketService {
  constructor() {
    this.tickets = [...ticketsData];
  }

  async getAll() {
    await delay(300);
    return [...this.tickets];
  }

  async getById(id) {
    await delay(200);
    const ticket = this.tickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return { ...ticket };
  }

  async create(ticketData) {
    await delay(400);
    const newTicket = {
      id: Date.now().toString(),
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tickets.unshift(newTicket);
    return { ...newTicket };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Ticket not found');
    }
    
    this.tickets[index] = {
      ...this.tickets[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.tickets[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Ticket not found');
    }
    
    this.tickets.splice(index, 1);
return { success: true };
  }

  async bulkUpdate(ticketIds, updates) {
    await delay(400);
    const updatedTickets = [];
    
    for (const id of ticketIds) {
      const index = this.tickets.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tickets[index] = {
          ...this.tickets[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        updatedTickets.push({ ...this.tickets[index] });
      }
    }
    
    return updatedTickets;
  }

  async search(query) {
    await delay(250);
    const lowercaseQuery = query.toLowerCase();
    return this.tickets.filter(ticket => 
      ticket.subject.toLowerCase().includes(lowercaseQuery) ||
      ticket.description.toLowerCase().includes(lowercaseQuery) ||
      ticket.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getByStatus(status) {
    await delay(200);
    return this.tickets.filter(t => t.status === status);
  }

  async getByAssignee(assigneeId) {
    await delay(200);
    return this.tickets.filter(t => t.assigneeId === assigneeId);
  }
}

export default new TicketService();