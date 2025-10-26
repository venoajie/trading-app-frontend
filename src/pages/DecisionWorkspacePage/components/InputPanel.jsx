
// src/pages/DecisionWorkspacePage/components/InputPanel.jsx
import { Stack, Title, TextInput, Text, NumberInput, Grid, Card, Group, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDecisionStore } from '../../../store/decisionStore';

export function InputPanel() {
  const { tradeIdea, setTradeIdea, assumptions, updateAssumption, archiveDecision } = useDecisionStore();

  const handleSave = () => {
    const result = archiveDecision();
    notifications.show({
      title: result.saved ? 'Success' : 'Error',
      message: result.message,
      color: result.saved ? 'green' : 'red',
    });
  };

  return (
    <Stack>
      <Title order={3}>1. Define Idea</Title>
      <TextInput
        label="Trade or Investment Idea"
        placeholder="e.g., Long NVDA due to AI demand"
        value={tradeIdea}
        onChange={(event) => setTradeIdea(event.currentTarget.value)}
      />
      
      <Title order={3} mt="lg">2. Define Outcomes</Title>
      <Text c="dimmed" size="sm">
        Define the possible outcomes and your estimated probability for each.
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

      <Title order={3} mt="lg">3. Set Context</Title>
      <Text c="dimmed" size="sm">
        Review how this idea fits within your current portfolio.
      </Text>
      <Card withBorder p="md" radius="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm">Portfolio Value:</Text>
            <Text size="sm" fw={500}>${(100000).toLocaleString()}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Available Cash:</Text>
            <Text size="sm" fw={500}>${(5000).toLocaleString()}</Text>
          </Group>
        </Stack>
      </Card>

      {/* --- NEW: Save Button --- */}
      <Button mt="xl" onClick={handleSave}>
        Save to Journal
      </Button>
    </Stack>
  );
}