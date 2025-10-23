
// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Layout and Page Imports ---
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage'; // This is now the public landing page
import { TermsOfServicePage } from './pages/legal/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// --- [ADD NEW PAGE IMPORTS] ---
import { PortfolioPage } from './pages/PortfolioPage';
import { RiskManagementPage } from './pages/RiskManagementPage';
import { PerformancePage } from './pages/PerformancePage';
import { MarketUpdatePage } from './pages/MarketUpdatePage';
import { TechnicalAnalysisPage } from './pages/TechnicalAnalysisPage';
// --- [END NEW IMPORTS] ---

import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
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
          path="risk-management" 
          element={<ProtectedRoute><RiskManagementPage /></ProtectedRoute>} 
        />
        <Route 
          path="performance" 
          element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} 
        />
        
      </Route>
    </Routes>
  );
}

export default App;