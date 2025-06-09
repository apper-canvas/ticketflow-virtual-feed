import { delay } from '../index';
import agentsData from '../mockData/agents.json';

class AgentService {
  constructor() {
    this.agents = [...agentsData];
  }

  async getAll() {
    await delay(200);
    return [...this.agents];
  }

  async getById(id) {
    await delay(150);
    const agent = this.agents.find(a => a.id === id);
    if (!agent) {
      throw new Error('Agent not found');
    }
    return { ...agent };
  }

  async create(agentData) {
    await delay(300);
    const newAgent = {
      id: Date.now().toString(),
      ...agentData,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(agentData.name)}&background=7C3AED&color=fff`
    };
    this.agents.unshift(newAgent);
    return { ...newAgent };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Agent not found');
    }
    
    this.agents[index] = {
      ...this.agents[index],
      ...updates
    };
    
    return { ...this.agents[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Agent not found');
    }
    
    this.agents.splice(index, 1);
    return { success: true };
  }
}

export default new AgentService();