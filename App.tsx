
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainSidebar from './components/MainSidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Tables from './pages/Tables';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Inventory from './pages/Inventory';
import Finance from './pages/Finance';
import Procurement from './pages/Procurement';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import Customers from './pages/Customers';
import Enterprise from './pages/Enterprise';
import Loyalty from './pages/Loyalty';
import Promotions from './pages/Promotions';
import StaffLockScreen from './components/StaffLockScreen';
import ShiftReportModal from './components/ShiftReportModal';
import ToastContainer from './components/ToastContainer';
import { Employee, Shift } from './types';
import { useStore } from './store';

const App: React.FC = () => {
  const { currentUser, setCurrentUser, currentShift, setCurrentShift, themeColor, checkOut } = useStore();
  const [showShiftReport, setShowShiftReport] = useState(false);
  const [isMainSidebarMinimized, setIsMainSidebarMinimized] = useState(true);

  useEffect(() => {
    applyThemeColor(themeColor);
  }, [themeColor]);

  const applyThemeColor = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color);
    // Tạo màu glow (độ mờ 20%)
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    document.documentElement.style.setProperty('--primary-glow', `rgba(${r}, ${g}, ${b}, 0.2)`);
  };

  const handleUnlock = (employee: Employee) => {
    setCurrentUser(employee);
    // Note: checkIn record is now handled directly in StaffLockScreen
  };

  const initiateLogout = () => {
    if (currentUser?.role === 'Waiter') {
      handleFinalLogout();
    } else {
      setShowShiftReport(true);
    }
  };

  const handleFinalLogout = (reportData?: any) => {
    if (currentUser) {
      checkOut(currentUser.id, {
        totalSales: reportData?.totalSales || 0,
        ordersCount: reportData?.ordersCount || 0,
        status: reportData?.discrepancy === 0 ? 'normal' : 'early_checkout'
      });
    }
    setCurrentUser(null);
    setCurrentShift(null);
    setShowShiftReport(false);
  };

  if (!currentUser) {
    return <StaffLockScreen onUnlock={handleUnlock} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#F4F6FF] flex flex-col relative">
        <ToastContainer />
        <Sidebar onLogout={initiateLogout} currentUser={currentUser} />

        <div className="flex flex-1">
          <MainSidebar
            isMinimized={isMainSidebarMinimized}
            onToggle={() => setIsMainSidebarMinimized(!isMainSidebarMinimized)}
          />

          <main
            className={`flex-1 pt-24 transition-all duration-500 ease-in-out ${isMainSidebarMinimized ? 'pl-24' : 'pl-72'
              } pr-3 pb-3 overflow-x-hidden`}
          >
            <div className="h-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/procurement" element={<Procurement />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/enterprise" element={<Enterprise />} />
                <Route path="/loyalty" element={<Loyalty />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>

        {showShiftReport && (
          <ShiftReportModal
            employee={currentUser}
            onClose={() => setShowShiftReport(false)}
            onConfirm={handleFinalLogout}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
