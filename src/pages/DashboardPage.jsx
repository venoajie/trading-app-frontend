
// src/pages/PortfolioDashboardPage/PortfolioDashboardPage.jsx
import { Grid, Card, Title, Text, Group, Stack } from '@mantine/core';
import { GoalManager } from './components/GoalManager';
import { LiquidityProfile } from './components/LiquidityProfile';
import { Doughnut } from 'react-chartjs-2';

// CORRECTIVE ACTION: Remove local Chart.js registration. It is now handled globally in App.jsx.

const riskExposureData = {
  labels: ['US Equities', 'Intl Equities', 'Fixed Income', 'Commodities', 'Cash'],
  datasets: [
    {
      label: 'Portfolio Allocation',
      data: [45000, 25000, 15000, 10000, 5000],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
        },
    },
};

export function PortfolioDashboardPage() {
  return (
    <Grid>
      {/* --- Portfolio Summary --- */}
      <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
        <Card withBorder shadow="sm" radius="md" padding="lg" h="100%">
          <Title order={4}>Portfolio Summary</Title>
          <Text c="dimmed" size="sm" mt="xs">Overall Health & Vitals</Text>
          <Stack mt="xl" gap="sm">
            <Group justify="space-between">
              <Text>Total Value</Text>
              <Text fw={500}>$100,000</Text>
            </Group>
            <Group justify="space-between">
              <Text>24h Change</Text>
              <Text c="green" fw={500}>+$1,250 (+1.25%)</Text>
            </Group>
            <Group justify="space-between">
              <Text>Target Progress</Text>
              <Text fw={500}>65%</Text>
            </Group>
          </Stack>
        </Card>
      </Grid.Col>

      {/* --- Liquidity Profile --- */}
      <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
        <LiquidityProfile />
      </Grid.Col>

      {/* --- Risk Exposure Map --- */}
      <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
        <Card withBorder shadow="sm" radius="md" padding="lg" style={{ height: '100%' }}>
          <Title order={4}>Risk Exposure Map</Title>
          <Text c="dimmed" size="sm" mt="xs">Asset Class Concentration</Text>
          <div style={{ height: 180, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Doughnut data={riskExposureData} options={chartOptions} />
          </div>
        </Card>
      </Grid.Col>

      {/* --- Target Alignment Matrix --- */}
      <Grid.Col span={12}>
        <Card withBorder shadow="sm" radius="md" padding="lg">
          <Title order={4}>Target Alignment Matrix</Title>
          <Text c="dimmed" size="sm" mt="xs">Progress Towards Financial Goals</Text>
          <GoalManager />
        </Card>
      </Grid.Col>
    </Grid>
  );
}