import React from 'react';

const FormField = ({ label, children, className = '', ...props }) => {
    const id = React.useId(); // Generates a unique ID for label-input association
    return (
        <div className={className} {...props}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            {React.Children.map(children, child =>
                React.cloneElement(child, { id: id, ...child.props })
            )}
        </div>
    );
};

export default FormField;