// src/pages/DashboardPage.tsx
import { Tabs, Title, Stack } from '@mantine/core';
import { IconArrowsExchange, IconLayoutDashboard } from '@mantine/icons-react'; // REMOVED: IconChartAreaLine
import { PortfolioTab } from './DashboardPage/components/PortfolioTab';
import { PerformanceTab } from './DashboardPage/components/PerformanceTab';
// --- ADD THIS IMPORT ---
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
          {/* NOTE: You removed the Performance tab, so I am leaving it out. */}
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
          {/* This now correctly renders our functional component */}
          <TransactionsTab />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

export default DashboardPage;
