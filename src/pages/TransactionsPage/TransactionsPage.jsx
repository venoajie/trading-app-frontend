
// src/pages/TransactionsPage/TransactionsPage.jsx
import { useState, useEffect } from 'react';
import { Title, Button, Stack, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications'; // Need to add this provider in main.jsx
import apiClient from '../../services/apiClient';
import { TransactionsTable } from './components/TransactionsTable';
import { TransactionModal } from './components/TransactionModal';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  
  // A placeholder portfolio ID. In a real app, this would come from user data.
  const portfolioId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // This endpoint needs to be created in the backend.
      // GET /portfolios/{portfolio_id}/transactions
      const response = await apiClient.get(`/portfolios/${portfolioId}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      notifications.show({
        title: 'Failed to fetch transactions',
        message: error.response?.data?.detail || 'Please try again later.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransactionSave = () => {
    closeModal();
    fetchTransactions(); // Refresh the data grid
  };

  return (
    <Stack>
      <Title order={1}>My Transactions</Title>
      <Button onClick={openModal} style={{ alignSelf: 'flex-start' }}>
        Add Transaction
      </Button>
      
      <TransactionModal 
        opened={modalOpened} 
        onClose={closeModal} 
        onSave={handleTransactionSave}
        portfolioId={portfolioId}
      />

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <TransactionsTable transactions={transactions} />
      </div>
    </Stack>
  );
}