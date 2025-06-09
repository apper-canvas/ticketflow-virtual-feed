import { delay } from '../index';
import customersData from '../mockData/customers.json';

class CustomerService {
  constructor() {
    this.customers = [...customersData];
  }

  async getAll() {
    await delay(250);
    return [...this.customers];
  }

  async getById(id) {
    await delay(200);
    const customer = this.customers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return { ...customer };
  }

  async create(customerData) {
    await delay(300);
    const newCustomer = {
      id: Date.now().toString(),
      ...customerData,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerData.name)}&background=2563EB&color=fff`
    };
    this.customers.unshift(newCustomer);
    return { ...newCustomer };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    this.customers[index] = {
      ...this.customers[index],
      ...updates
    };
    
    return { ...this.customers[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    this.customers.splice(index, 1);
    return { success: true };
  }
}

export default new CustomerService();