import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import CustomersPage from '@/components/pages/CustomersPage';
import ReportsPage from '@/components/pages/ReportsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
          <Route path="inbox" element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;