
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TermsOfServicePage } from './pages/legal/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage'; // Import new page

function App() {
  return (
    <Routes>
      {/* Authenticated Routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} /> {/* Add new route */}
      </Route>

      {/* Public Routes */}
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    </Routes>
  );
}

export default App;