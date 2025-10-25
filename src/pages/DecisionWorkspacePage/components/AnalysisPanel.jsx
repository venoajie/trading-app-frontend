
// src/pages/DecisionWorkspacePage/components/AnalysisPanel.jsx
import { Stack, Title, Text, Paper, Center } from '@mantine/core';
import { useDecisionStore } from '../../../store/decisionStore';

export function AnalysisPanel() {
  const { expectedValue } = useDecisionStore();

  return (
    <Stack>
      <Title order={3}>3. Analyze</Title>
      <Paper withBorder p="xl" radius="md">
        <Stack align="center">
          <Text c="dimmed" size="sm">Calculated Expected Value (EV)</Text>
          <Title order={1}>${expectedValue.toFixed(2)}</Title>
        </Stack>
      </Paper>
      
      <Title order={4} mt="md">Risk / Reward Profile</Title>
      <Paper withBorder style={{ height: 300 }}>
        <Center style={{ height: '100%' }}>
            <Text c="dimmed">Payoff Diagram (Recharts) will be implemented here.</Text>
        </Center>
      </Paper>
    </Stack>
  );
}