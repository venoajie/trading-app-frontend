
// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Layout and Page Imports (Existing) ---
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TermsOfServicePage } from './pages/legal/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage';

// --- Import New Auth Pages ---
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// --- Import the Auth Store ---
import useAuthStore from './store/authStore';


// --- Protective Route Component ---
// This component's logic is now simpler and uses the store.
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
      {/* --- Public Routes --- */}
      {/* These routes are accessible to everyone and do NOT use the AppLayout. */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

      {/* --- Main Application Routes with Shared Layout --- */}
      {/* The AppLayout is now public, allowing visitors to see the main shell. */}
      <Route path="/" element={<AppLayout />}>
        {/* The Dashboard is now the public landing page */}
        <Route index element={<DashboardPage />} />

        {/* The Transactions page is sensitive and remains PROTECTED. */}
        <Route 
          path="transactions" 
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Add any other future protected routes here using the same pattern */}
      </Route>
    </Routes>
  );
}

export default App;