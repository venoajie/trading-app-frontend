// src/pages/DashboardPage/components/PerformanceTab.tsx
import { Alert, Center } from '@mantine/core';
import { IconChartInfographic } from '@tabler/icons-react';

export function PerformanceTab() {
  return (
    <Center style={{ height: '400px' }}>
      <Alert
        icon={<IconChartInfographic size="1.5rem" />}
        title="Performance Analysis"
        color="gray"
        variant="outline"
      >
        The interactive performance chart and key metrics will be displayed
        here.
      </Alert>
    </Center>
  );
}
