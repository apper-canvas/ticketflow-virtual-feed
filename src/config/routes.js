import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

export const routes = {
  inbox: {
    id: 'inbox',
    label: 'Inbox',
    path: '/inbox',
    icon: 'Inbox',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: Dashboard
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
    component: Customers
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'FileText',
    component: Reports
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);