
// src/pages/DecisionWorkspacePage/components/InputPanel.jsx
import { Stack, Title, TextInput, Text, NumberInput, Grid } from '@mantine/core';
import { useDecisionStore } from '../../../store/decisionStore';

export function InputPanel() {
  const { tradeIdea, setTradeIdea, assumptions, updateAssumption } = useDecisionStore();

  return (
    <Stack>
      <Title order={3}>1. Define Idea</Title>
      <TextInput
        label="Trade or Investment Idea"
        placeholder="e.g., Long NVDA due to AI demand"
        value={tradeIdea}
        onChange={(event) => setTradeIdea(event.currentTarget.value)}
      />
      
      <Title order={3} mt="lg">2. Set Assumptions</Title>
      <Text c="dimmed" size="sm">
        Define the possible outcomes and your estimated probability for each. Probabilities must sum to 1.0.
      </Text>

      {assumptions.map((assumption, index) => (
        <Grid key={index} align="flex-end">
          <Grid.Col span={5}>
            <Text size="sm" fw={500}>{assumption.scenario}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Probability"
              placeholder="e.g., 0.5"
              value={assumption.probability}
              onChange={(value) => updateAssumption(index, 'probability', value)}
              min={0}
              max={1}
              step={0.01}
              decimalScale={2}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="Outcome ($)"
              value={assumption.outcome}
              onChange={(value) => updateAssumption(index, 'outcome', value)}
              prefix="$"
            />
          </Grid.Col>
        </Grid>
      ))}
    </Stack>
  );
}