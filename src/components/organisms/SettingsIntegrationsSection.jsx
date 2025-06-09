import React from 'react';
import IntegrationCard from '@/components/molecules/IntegrationCard';

const SettingsIntegrationsSection = ({ settings, onSettingChange, className = '', ...props }) => {
    return (
        <div className={`space-y-6 ${className}`} {...props}>
            <IntegrationCard
                iconName="MessageCircle"
                iconBgColorClass="bg-purple-100"
                iconColorClass="text-purple-600"
                title="Slack Integration"
                description="Get notifications in Slack channels"
                buttonLabel={settings.slackIntegration ? 'Connected' : 'Connect'}
                onButtonClick={() => onSettingChange('slackIntegration', !settings.slackIntegration)}
                isConnected={settings.slackIntegration}
            />

            <IntegrationCard
                iconName="Mail"
                iconBgColorClass="bg-blue-100"
                iconColorClass="text-blue-600"
                title="Email Integration"
                description="Connect email for ticket creation"
                buttonLabel="Connected"
                onButtonClick={() => { /* no-op, always connected */ }}
                isConnected={true}
            />

            <IntegrationCard
                iconName="Code"
                iconBgColorClass="bg-green-100"
                iconColorClass="text-green-600"
                title="API Access"
                description="Integrate with external systems"
                buttonLabel="Configure"
                onButtonClick={() => { /* Simulate configure action */ }}
                isConnected={false} // Assuming 'Configure' means not yet fully connected
            />
        </div>
    );
};

export default SettingsIntegrationsSection;