import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    companyName: 'TicketFlow Support',
    supportEmail: 'support@ticketflow.com',
    autoAssign: true,
    emailNotifications: true,
    slackIntegration: false,
    defaultPriority: 'medium',
    autoCloseResolved: 7
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'integrations', label: 'Integrations', icon: 'Zap' },
    { id: 'sla', label: 'SLA Rules', icon: 'Clock' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Simulate save operation
    toast.success('Settings saved successfully');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Priority
              </label>
              <select
                value={settings.defaultPriority}
                onChange={(e) => handleSettingChange('defaultPriority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Auto-assign Tickets</h4>
                <p className="text-sm text-gray-600">Automatically assign new tickets to available agents</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoAssign', !settings.autoAssign)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  settings.autoAssign ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoAssign ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive email alerts for new tickets and updates</p>
              </div>
              <button
                onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  settings.emailNotifications ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-close Resolved Tickets (days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.autoCloseResolved}
                onChange={(e) => handleSettingChange('autoCloseResolved', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <p className="text-sm text-gray-600 mt-1">
                Automatically close tickets after they've been resolved for this many days
              </p>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <ApperIcon name="MessageCircle" className="text-purple-600" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Slack Integration</h4>
                  <p className="text-sm text-gray-600">Get notifications in Slack channels</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('slackIntegration', !settings.slackIntegration)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  settings.slackIntegration 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {settings.slackIntegration ? 'Connected' : 'Connect'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <ApperIcon name="Mail" className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Integration</h4>
                  <p className="text-sm text-gray-600">Connect email for ticket creation</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Connected
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <ApperIcon name="Code" className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">API Access</h4>
                  <p className="text-sm text-gray-600">Integrate with external systems</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Configure
              </button>
            </div>
          </div>
        );

      case 'sla':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <ApperIcon name="AlertTriangle" className="text-yellow-600 mr-2" size={16} />
                <h4 className="text-sm font-medium text-yellow-800">SLA Configuration</h4>
              </div>
              <p className="text-sm text-yellow-700">
                Set response time targets for different priority levels
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgent Priority Response Time (hours)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    defaultValue="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    High Priority Response Time (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    defaultValue="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medium Priority Response Time (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    defaultValue="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Priority Response Time (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    defaultValue="24"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Escalation Rules</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Auto-escalate overdue urgent tickets</span>
                  <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Notify manager on SLA breach</span>
                  <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your support system preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <ApperIcon name={tab.icon} size={18} className="mr-3 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
            </div>

            {renderTabContent()}

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Settings;