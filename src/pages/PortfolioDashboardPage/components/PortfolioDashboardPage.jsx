
// src/pages/PortfolioDashboardPage/PortfolioDashboardPage.jsx
import { Grid, Card, Title, Text, Group, Paper, Center } from '@mantine/core';
import { GoalManager } from './components/GoalManager'; // Import the new GoalManager

// A custom component for the Treemap tooltip for better styling
const CustomTreemapTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper withBorder shadow="md" p="xs" radius="sm">
        <Text fw={500}>{data.name}</Text>
        <Text size="sm">${data.size.toLocaleString()}</Text>
      </Paper>
    );
  }
  return null;
};

function PortfolioDashboardPage() {
  return (
    <Grid>
      {/* --- Portfolio Summary --- */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder shadow="sm" radius="md" padding="lg">
          <Title order={4}>Portfolio Summary</Title>
          <Text c="dimmed" size="sm" mt="xs">Overall Health & Vitals</Text>
          <Group justify="space-between" mt="xl">
            <Text>Total Value</Text>
            <Text fw={500}>$100,000</Text>
          </Group>
          <Group justify="space-between" mt="sm">
            <Text>24h Change</Text>
            <Text c="green" fw={500}>+$1,250 (+1.25%)</Text>
          </Group>
           <Group justify="space-between" mt="sm">
            <Text>Target Progress</Text>
            <Text fw={500}>65%</Text>
          </Group>
        </Card>
      </Grid.Col>

      {/* --- Risk Exposure Map --- */}
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Card withBorder shadow="sm" radius="md" padding="lg" style={{ height: '100%' }}>
          <Title order={4}>Risk Exposure Map</Title>
           <Text c="dimmed" size="sm" mt="xs">Asset Class Concentration</Text>
          <Center style={{ height: 250 }}>
            <Text c="dimmed">Chart component is temporarily disabled for testing.</Text>
          </Center>
        </Card>
      </Grid.Col>

      {/* --- Target Alignment Matrix --- */}
      <Grid.Col span={12}>
         <Card withBorder shadow="sm" radius="md" padding="lg">
          <Title order={4}>Target Alignment Matrix</Title>
           <Text c="dimmed" size="sm" mt="xs">Progress Towards Financial Goals</Text>
           {/* Replace the static table with the new interactive GoalManager */}
           <GoalManager />
        </Card>
      </Grid.Col>
    </Grid>
  );
}

export default PortfolioDashboardPage;