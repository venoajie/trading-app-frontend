// src/pages/DashboardPage/components/TransactionsTab.tsx
import {
  Stack,
  Button,
  Skeleton,
  Center,
  Alert,
  Text,
  Group,
} from '@mantine/core';
// REMOVED: useDisclosure is no longer needed
import { IconInfoCircle } from '@tabler/icons-react';
import { useUiStore } from '../../../store/uiStore'; // Import the UI store
import { useTransactions } from '../../TransactionsPage/hooks/useTransactions';
import { TransactionsTable } from '../../TransactionsPage/components/TransactionsTable';
// REMOVED: TransactionModal is no longer rendered here

export function TransactionsTab() {
  // FIX: Use the global state from the uiStore
  const { openTransactionModal } = useUiStore();
  const { data: transactions, isLoading, isError, error } = useTransactions();

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton height={300} radius="md" />;
    }

    if (isError) {
      return (
        <Center style={{ height: '300px' }}>
          <Alert
            icon={<IconInfoCircle size="1rem" />}
            title="Error"
            color="red"
          >
            <Text>Failed to load transactions: {error.message}</Text>
          </Alert>
        </Center>
      );
    }

    return <TransactionsTable transactions={transactions || []} />;
  };

  return (
    // The TransactionModal is no longer rendered here
    <Stack>
      <Group justify="flex-end">
        {/* This button now triggers the global state change */}
        <Button onClick={openTransactionModal}>Add Transaction</Button>
      </Group>
      {renderContent()}
    </Stack>
  );
}
