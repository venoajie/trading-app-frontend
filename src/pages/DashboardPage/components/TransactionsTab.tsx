// src/pages/DashboardPage/components/TransactionsTab.tsx
import { Stack, Button, Skeleton, Center, Alert, Text } from '@mantine/core'; // REMOVED: Group
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTransactions } from '../../TransactionsPage/hooks/useTransactions';
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
      {/* --- FIX: Replaced <Group> with a more direct alignment on the <Button> --- */}
      <Stack>
        <Button onClick={openModal} style={{ alignSelf: 'flex-end' }}>
          Add Transaction
        </Button>
        {renderContent()}
      </Stack>
    </>
  );
}
