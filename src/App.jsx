
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


// --- Protective Route Component ---
// This component will wrap our authenticated layout.
// It checks for the access token in localStorage.
// If the token exists, it shows the content (the AppLayout).
// If not, it redirects the user to the login page.
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
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

      {/* --- Authenticated Routes --- */}
      {/* This entire section is now wrapped by our ProtectedRoute. */}
      {/* If a user tries to access '/', '/transactions', etc., the ProtectedRoute */}
      {/* will check for authentication first. */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
      </Route>
    </Routes>
  );
}

export default App;