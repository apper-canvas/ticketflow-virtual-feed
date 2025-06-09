import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentRoute = routeArray.find(route => 
    location.pathname === route.path || 
    (route.path === '/inbox' && location.pathname === '/')
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Ticket" className="text-white" size={20} />
            </div>
            <h1 className="font-heading font-semibold text-xl text-gray-900 hidden sm:block">
              TicketFlow
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={16} 
              />
              <input
                type="text"
                placeholder="Search tickets, customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SA</span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                Sarah Agent
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface border-r border-gray-200 flex-col z-40">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive || (route.path === '/inbox' && location.pathname === '/')
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={18} className="mr-3 flex-shrink-0" />
                <span className="truncate">{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-surface border-r border-gray-200 flex-col z-50"
            >
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {routeArray.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                        isActive || (route.path === '/inbox' && location.pathname === '/')
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} size={18} className="mr-3 flex-shrink-0" />
                    <span className="truncate">{route.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Layout;