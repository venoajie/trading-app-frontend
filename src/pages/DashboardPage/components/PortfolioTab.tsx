// src/pages/DashboardPage/components/PortfolioTab.tsx
import { Alert, Center } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';

export function PortfolioTab() {
  return (
    <Center style={{ height: '400px' }}>
      <Alert
        icon={<IconBriefcase size="1.5rem" />}
        title="Portfolio Overview"
        color="gray"
        variant="outline"
      >
        The portfolio breakdown, including asset allocation and risk exposure,
        will be displayed here.
      </Alert>
    </Center>
  );
}
