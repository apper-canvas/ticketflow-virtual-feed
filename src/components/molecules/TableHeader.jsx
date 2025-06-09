import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';

const TableHeader = ({
  columns,
  sortConfig,
  onSort,
  onSelectAll,
  selectedCount,
  totalCount,
  className = ''
}) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ApperIcon name="ArrowUp" className="w-4 h-4 text-primary" />
      : <ApperIcon name="ArrowDown" className="w-4 h-4 text-primary" />;
  };

  return (
    <thead className={`bg-gray-50 ${className}`}>
      <tr>
        <th className="w-10 px-4 py-3">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={onSelectAll}
          />
        </th>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            onClick={column.sortable ? () => onSort(column.key) : undefined}
          >
            <div className="flex items-center gap-2">
              <span>{column.label}</span>
              {column.sortable && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0"
                >
                  {getSortIcon(column.key)}
                </motion.div>
              )}
            </div>
          </th>
        ))}
        <th className="w-20 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;