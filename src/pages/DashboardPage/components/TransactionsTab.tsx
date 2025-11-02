// src/pages/DashboardPage/components/TransactionsTab.tsx
import { Alert, Center } from '@mantine/core';
import { IconTool } from '@tabler/icons-react';

export function TransactionsTab() {
  return (
    <Center style={{ height: '400px' }}>
      <Alert
        icon={<IconTool size="1.5rem" />}
        title="Under Construction"
        color="gray"
        variant="outline"
      >
        The full transactions management feature will be implemented here.
      </Alert>
    </Center>
  );
}
