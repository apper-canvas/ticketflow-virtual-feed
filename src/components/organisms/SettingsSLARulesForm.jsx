import React from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import InfoMessage from '@/components/molecules/InfoMessage';

const SettingsSLARulesForm = ({ className = '', ...props }) => {
    // These values are hardcoded in the original, so keeping them here
    // In a real app, they would be part of `settings` state and handled by `onSettingChange`
    return (
        <div className={`space-y-6 ${className}`} {...props}>
            <InfoMessage
                iconName="AlertTriangle"
                iconColorClass="text-yellow-600"
                title="SLA Configuration"
                message="Set response time targets for different priority levels"
            />

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Urgent Priority Response Time (hours)">
                        <Input type="number" min="0.5" step="0.5" defaultValue="1" />
                    </FormField>
                    <FormField label="High Priority Response Time (hours)">
                        <Input type="number" min="1" step="1" defaultValue="4" />
                    </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Medium Priority Response Time (hours)">
                        <Input type="number" min="1" step="1" defaultValue="8" />
                    </FormField>
                    <FormField label="Low Priority Response Time (hours)">
                        <Input type="number" min="1" step="1" defaultValue="24" />
                    </FormField>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Escalation Rules</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Auto-escalate overdue urgent tickets</span>
                        {/* Original component had hardcoded 'bg-primary' and 'translate-x-5' */}
                        <ToggleSwitch checked={true} onChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Notify manager on SLA breach</span>
                        {/* Original component had hardcoded 'bg-primary' and 'translate-x-5' */}
                        <ToggleSwitch checked={true} onChange={() => {}} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSLARulesForm;