import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const CustomerSearch = ({ searchTerm, onSearchChange, className = '', ...props }) => {
    return (
        <div className={`mb-6 ${className}`} {...props}>
            <div className="relative max-w-md">
                <ApperIcon
                    name="Search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                />
                <Input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="pl-10 pr-4"
                />
            </div>
        </div>
    );
};

export default CustomerSearch;