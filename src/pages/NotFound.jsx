import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ApperIcon name="AlertTriangle" className="w-16 h-16 text-gray-400 mx-auto" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link
          to="/inbox"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <ApperIcon name="ArrowLeft" className="mr-2" size={18} />
          Back to Inbox
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;