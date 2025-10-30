
// src/pages/DashboardPage/components/TransactionsTab.jsx
import { useState, useEffect } from 'react';
import { Button, Stack, LoadingOverlay, Alert, Center } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../services/apiClient';
import { TransactionsTable } from '../../TransactionsPage/components/TransactionsTable';
import { TransactionModal } from '../../TransactionsPage/components/TransactionModal';

export function TransactionsTab() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/transactions');
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
    fetchTransactions();
  };

  return (
    <Stack>
      <TransactionModal 
        opened={modalOpened} 
        onClose={closeModal} 
        onSave={handleTransactionSave}
      />
      <Button onClick={openModal} style={{ alignSelf: 'flex-end' }}>
        Add Transaction
      </Button>
      
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        {!loading && transactions.length === 0 ? (
          <Center style={{ height: '200px' }}>
            <Alert icon={<IconInfoCircle size="1rem" />} title="No Transactions Found" color="blue">
              You haven't recorded any transactions yet. Click "Add Transaction" to get started!
            </Alert>
          </Center>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}
      </div>
    </Stack>
  );
}