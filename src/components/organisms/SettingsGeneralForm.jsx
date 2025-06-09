import React from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';

const SettingsGeneralForm = ({ settings, onSettingChange, className = '', ...props }) => {
    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
    ];

    return (
        <div className={`space-y-6 ${className}`} {...props}>
            <FormField label="Company Name">
                <Input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => onSettingChange('companyName', e.target.value)}
                />
            </FormField>

            <FormField label="Support Email">
                <Input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => onSettingChange('supportEmail', e.target.value)}
                />
            </FormField>

            <FormField label="Default Priority">
                <Select
                    value={settings.defaultPriority}
                    onChange={(e) => onSettingChange('defaultPriority', e.target.value)}
                    options={priorityOptions}
                />
            </FormField>

            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">Auto-assign Tickets</h4>
                    <p className="text-sm text-gray-600">Automatically assign new tickets to available agents</p>
                </div>
                <ToggleSwitch
                    checked={settings.autoAssign}
                    onChange={() => onSettingChange('autoAssign', !settings.autoAssign)}
                />
            </div>
        </div>
    );
};

export default SettingsGeneralForm;