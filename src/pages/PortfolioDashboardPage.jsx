
// src/pages/PortfolioDashboardPage.jsx
import { Grid, Card, Title, Text, Group, RingProgress, Table, Paper, Center } from '@mantine/core';
// import { Treemap, ResponsiveContainer } from 'recharts'; // Temporarily commented out

// --- Mock Data for Visualization ---
const targetAlignmentData = [
  { goal: 'Retirement (2050)', progress: 75, strategy: 'Long-Term Growth', effectiveness: 'High' },
  { goal: 'Home Down Payment (2028)', progress: 40, strategy: 'Balanced Growth', effectiveness: 'Medium' },
  { goal: 'Education Fund (2035)', progress: 60, strategy: 'Growth & Income', effectiveness: 'High' },
];

function PortfolioDashboardPage() {
  const rows = targetAlignmentData.map((row) => (
    <Table.Tr key={row.goal}>
      <Table.Td>{row.goal}</Table.Td>
      <Table.Td>
        <RingProgress
          size={50}
          thickness={5}
          roundCaps
          sections={[{ value: row.progress, color: 'blue' }]}
          label={<Text c="blue" fw={700} align="center" size="xs">{row.progress}%</Text>}
        />
      </Table.Td>
      <Table.Td>{row.strategy}</Table.Td>
      <Table.Td>{row.effectiveness}</Table.Td>
    </Table.Tr>
  ));

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
          {/* DIAGNOSTIC ACTION: Replaced Treemap with a placeholder */}
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
          <Table mt="md" verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Goal</Table.Th>
                <Table.Th>Progress</Table.Th>
                <Table.Th>Strategy</Table.Th>
                <Table.Th>Effectiveness</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Card>
      </Grid.Col>
    </Grid>
  );
}

export default PortfolioDashboardPage;