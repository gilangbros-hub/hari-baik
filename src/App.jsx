import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import { useLocalStorage } from './hooks/useLocalStorage';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ModeSelectPage from './pages/ModeSelectPage';
import DashboardPage from './pages/DashboardPage';
import ChecklistPage from './pages/ChecklistPage';
import BudgetPage from './pages/BudgetPage';
import VendorPage from './pages/VendorPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [user, setUser] = useLocalStorage('rhb_user', null);

  const ProtectedRoute = ({ children }) => {
    // Demo mode: skip auth if testing UI
    // if (!user) return <Navigate to="/landing" replace />;
    return (
      <>
        <main className="main-content">
          {children}
        </main>
        <BottomNav />
      </>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mode" element={<ModeSelectPage />} />

        {/* Protected shell */}
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/checklist" element={<ProtectedRoute><ChecklistPage /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
        <Route path="/vendor" element={<ProtectedRoute><VendorPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
