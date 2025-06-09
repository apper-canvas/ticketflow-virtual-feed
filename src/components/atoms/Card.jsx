import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', initial = {}, animate = {}, transition = {}, ...props }) => {
    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={transition}
            className={`bg-white p-6 rounded-lg border border-gray-200 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;