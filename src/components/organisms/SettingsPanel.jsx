import React from 'react';
import { motion } from 'framer-motion';
import TabButton from '@/components/molecules/TabButton';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import SettingsGeneralForm from './SettingsGeneralForm';
import SettingsNotificationsForm from './SettingsNotificationsForm';
import SettingsIntegrationsSection from './SettingsIntegrationsSection';
import SettingsSLARulesForm from './SettingsSLARulesForm';

const SettingsPanel = ({
    activeTab,
    setActiveTab,
    tabs,
    settings,
    onSettingChange,
    onSave,
    className = '',
    ...props
}) => {
    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <SettingsGeneralForm settings={settings} onSettingChange={onSettingChange} />;
            case 'notifications':
                return <SettingsNotificationsForm settings={settings} onSettingChange={onSettingChange} />;
            case 'integrations':
                return <SettingsIntegrationsSection settings={settings} onSettingChange={onSettingChange} />;
            case 'sla':
                return <SettingsSLARulesForm />;
            default:
                return null;
        }
    };

    return (
        <div className={`flex flex-col lg:flex-row gap-6 ${className}`} {...props}>
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            id={tab.id}
                            label={tab.label}
                            iconName={tab.icon}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-2xl">
                <Card
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {tabs.find((tab) => tab.id === activeTab)?.label}
                        </h2>
                    </div>

                    {renderTabContent()}

                    <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                        <Button
                            onClick={onSave}
                            className="bg-primary text-white hover:bg-primary/90"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPanel;