export { default as ticketService } from './api/ticketService';
export { default as customerService } from './api/customerService';
export { default as internalNoteService } from './api/internalNoteService';
export { default as agentService } from './api/agentService';

// Utility function for delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));