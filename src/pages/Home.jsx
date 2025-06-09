import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="h-full max-w-full overflow-hidden"
    >
      <MainFeature />
    </motion.div>
  );
}

export default Home;