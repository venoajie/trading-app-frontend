
// src/pages/DecisionWorkspacePage/components/AnalysisPanel.jsx
import { Stack, Title, Text, Paper } from '@mantine/core';
import { useDecisionStore } from '../../../store/decisionStore';

// CORRECTIVE ACTION: Removed Bar chart component and related imports to isolate error.

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
      <Paper withBorder style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }} p="md">
         {/* Placeholder for removed chart */}
        <Text c="dimmed">[Chart temporarily disabled]</Text>
      </Paper>
    </Stack>
  );
}