
// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { DecisionWorkspacePage } from './pages/DecisionWorkspacePage/DecisionWorkspacePage';
import useAuthStore from './store/authStore';
// Other imports as needed...

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  useEffect(() => {
    // On initial app load, check if a token exists and try to validate the session.
    const token = useAuthStore.getState().token;
    if (token) {
      useAuthStore.getState().fetchUserOnLoad();
    } else {
      useAuthStore.getState().setLoadingComplete();
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Other standalone routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        {/* Other public routes */}
        <Route path="portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
        <Route path="transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path="decision-workspace" element={<ProtectedRoute><DecisionWorkspacePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;