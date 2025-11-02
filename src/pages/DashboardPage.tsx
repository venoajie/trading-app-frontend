// src/pages/DashboardPage.tsx
import { Tabs, Title, Stack } from '@mantine/core';
import {
  IconChartAreaLine,
  IconArrowsExchange,
  IconLayoutDashboard,
} from '@tabler/icons-react';
import { PortfolioTab } from './DashboardPage/components/PortfolioTab';
import { PerformanceTab } from './DashboardPage/components/PerformanceTab';
import { TransactionsTab } from './DashboardPage/components/TransactionsTab';
import { useEffect } from 'react';
import useDashboardStore from '../store/dashboardStore';

export function DashboardPage() {
  // Fetch data when the component mounts
  const { fetchDashboardData, isLoading } = useDashboardStore();

  useEffect(() => {
    // Only fetch if data isn't already loading to prevent duplicate calls
    if (!isLoading) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <Stack>
      <Title order={1}>Dashboard</Title>
      <Tabs defaultValue="portfolio" variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab
            value="portfolio"
            leftSection={<IconLayoutDashboard size={16} />}
          >
            Portfolio
          </Tabs.Tab>
          <Tabs.Tab
            value="performance"
            leftSection={<IconChartAreaLine size={16} />}
          >
            Performance
          </Tabs.Tab>
          <Tabs.Tab
            value="transactions"
            leftSection={<IconArrowsExchange size={16} />}
          >
            Transactions
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="portfolio" pt="xl">
          <PortfolioTab />
        </Tabs.Panel>

        <Tabs.Panel value="performance" pt="xl">
          <PerformanceTab />
        </Tabs.Panel>

        <Tabs.Panel value="transactions" pt="xl">
          <TransactionsTab />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

// Ensure default export for lazy loading in App.tsx
export default DashboardPage;
