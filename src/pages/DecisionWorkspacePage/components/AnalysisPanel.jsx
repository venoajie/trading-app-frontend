
// src/pages/DecisionWorkspacePage/components/AnalysisPanel.jsx
import { Stack, Title, Text, Paper } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDecisionStore } from '../../../store/decisionStore';

export function AnalysisPanel() {
  const { expectedValue, assumptions } = useDecisionStore();

  const chartData = assumptions.map(a => ({
    name: a.scenario,
    Outcome: a.outcome,
    // Add a color for each bar for better visual distinction
    fill: a.scenario === 'Best Case' ? '#40C057' : a.scenario === 'Worst Case' ? '#FA5252' : '#4DABF7',
  }));

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
      <Paper withBorder style={{ height: 300 }} p="md">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              cursor={{ fill: 'rgba(233, 236, 239, 0.5)' }}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="Outcome" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Stack>
  );
}