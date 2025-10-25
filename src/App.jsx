
// src/App.jsx
import { useEffect } from 'react'; // [ADD] Import useEffect
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
  // [ADD] This entire useEffect block is new
  useEffect(() => {
    const initializeAuth = () => {
      const token = useAuthStore.getState().token;
      if (token) {
        useAuthStore.getState().fetchUser();
      } else {
        // If there's no token, we're done loading.
        useAuthStore.getState().setLoadingComplete();
      }
    };
    initializeAuth();
  }, []); // The empty array ensures this runs only once on app startup

  return (
    <Routes>
      {/* --- Standalone Public Routes (No Layout) --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

      {/* --- Main Application Routes (with Shared Layout) --- */}
      <Route path="/" element={<AppLayout />}>
        
        {/* --- Public Pages --- */}
        <Route index element={<DashboardPage />} />
        <Route path="market-update" element={<MarketUpdatePage />} />
        <Route path="technical-analysis" element={<TechnicalAnalysisPage />} />

        {/* --- Private/Protected Pages --- */}
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