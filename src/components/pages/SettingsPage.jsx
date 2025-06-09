import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SettingsPanel from '@/components/organisms/SettingsPanel';

function SettingsPage() {
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
    console.log('Settings saved:', settings);
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your support system preferences</p>
      </div>

      <SettingsPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        settings={settings}
        onSettingChange={handleSettingChange}
        onSave={handleSave}
      />
    </div>
  );
}

export default SettingsPage;