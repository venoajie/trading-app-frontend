
// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Layout and Page Imports ---
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TermsOfServicePage } from './pages/legal/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import { MarketUpdatePage } from './pages/MarketUpdatePage';
import { TechnicalAnalysisPage } from './pages/TechnicalAnalysisPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';

import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    const initializeAuth = () => {
      const token = useAuthStore.getState().token;
      if (token) {
        // [MODIFIED] Pass the token from the store to the fetchUser function
        useAuthStore.getState().fetchUser(token);
      } else {
        useAuthStore.getState().setLoadingComplete();
      }
    };
    initializeAuth();
  }, []);

  return (
    <Routes>
      {/* ... routes ... */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="market-update" element={<MarketUpdatePage />} />
        <Route path="technical-analysis" element={<TechnicalAnalysisPage />} />
        <Route 
          path="portfolio" 
          element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} 
        />
        <Route 
          path="transactions" 
          element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} 
        />
        <Route 
          path="decision-workspace" 
          element={<ProtectedRoute><DecisionWorkspacePage /></ProtectedRoute>}
        />
      </Route>
    </Routes>
  );
}

export default App;