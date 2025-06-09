import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import CustomersPage from '@/components/pages/CustomersPage';
import ReportsPage from '@/components/pages/ReportsPage';
import SettingsPage from '@/components/pages/SettingsPage';

export const routes = {
  inbox: {
    id: 'inbox',
    label: 'Inbox',
    path: '/inbox',
    icon: 'Inbox',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
component: DashboardPage
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
component: CustomersPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'FileText',
component: ReportsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
component: SettingsPage
  }
};

export const routeArray = Object.values(routes);