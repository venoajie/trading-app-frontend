// src/pages/DashboardPage.tsx
import { Tabs, Title, Stack } from '@mantine/core';
// --- FIX: Corrected package name from '@mantine/icons-react' to '@tabler/icons-react' ---
import { IconArrowsExchange, IconLayoutDashboard } from '@tabler/icons-react';
import { PortfolioTab } from './DashboardPage/components/PortfolioTab';
import { PerformanceTab } from './DashboardPage/components/PerformanceTab';
import { TransactionsTab } from './DashboardPage/components/TransactionsTab';

export function DashboardPage() {
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

export default DashboardPage;
