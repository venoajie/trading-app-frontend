
// src/pages/PortfolioDashboardPage/PortfolioDashboardPage.jsx
import { Grid, Card, Title, Text, Group, Paper, Center, Stack } from '@mantine/core';
import { GoalManager } from './components/GoalManager';
import { LiquidityProfile } from './components/LiquidityProfile'; // Import the new component

function PortfolioDashboardPage() {
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

      {/* --- NEW: Liquidity Profile --- */}
      <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
        <LiquidityProfile />
      </Grid.Col>

      {/* --- Risk Exposure Map --- */}
      <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
        <Card withBorder shadow="sm" radius="md" padding="lg" style={{ height: '100%' }}>
          <Title order={4}>Risk Exposure Map</Title>
          <Text c="dimmed" size="sm" mt="xs">Asset Class Concentration</Text>
          <Center style={{ height: 180 }}>
            <Text c="dimmed">Chart component is temporarily disabled.</Text>
          </Center>
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

export default PortfolioDashboardPage;