import React from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';

const SettingsNotificationsForm = ({ settings, onSettingChange, className = '', ...props }) => {
    return (
        <div className={`space-y-6 ${className}`} {...props}>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email alerts for new tickets and updates</p>
                </div>
                <ToggleSwitch
                    checked={settings.emailNotifications}
                    onChange={() => onSettingChange('emailNotifications', !settings.emailNotifications)}
                />
            </div>

            <FormField label="Auto-close Resolved Tickets (days)">
                <Input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.autoCloseResolved}
                    onChange={(e) => onSettingChange('autoCloseResolved', parseInt(e.target.value))}
                />
                <p className="text-sm text-gray-600 mt-1">
                    Automatically close tickets after they've been resolved for this many days
                </p>
            </FormField>
        </div>
    );
};

export default SettingsNotificationsForm;