// src/pages/DashboardPage/components/TransactionsTab.tsx
import {
  Stack,
  Group,
  Button,
  Skeleton,
  Center,
  Alert,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTransactions } from '../../TransactionsPage/hooks/useTransactions'; // We can reuse the hook
import { TransactionsTable } from '../../TransactionsPage/components/TransactionsTable';
import { TransactionModal } from '../../TransactionsPage/components/TransactionModal';

export function TransactionsTab() {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
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
    <>
      <TransactionModal opened={modalOpened} onClose={closeModal} />
      <Stack>
        <Group justify="flex-end">
          <Button onClick={openModal}>Add Transaction</Button>
        </Group>
        {renderContent()}
      </Stack>
    </>
  );
}
