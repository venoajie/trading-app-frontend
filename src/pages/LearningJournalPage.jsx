
// src/pages/LearningJournalPage.jsx
import { Title, Text, Container, Accordion, Group, Table, Alert, Center } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useDecisionStore } from '../store/decisionStore';

function JournalEntry({ entry }) {
  const { tradeIdea, timestamp, expectedValue, assumptions } = entry;

  const rows = assumptions.map((a) => (
    <Table.Tr key={a.scenario}>
      <Table.Td>{a.scenario}</Table.Td>
      <Table.Td>{(a.probability * 100).toFixed(0)}%</Table.Td>
      <Table.Td>${a.outcome.toLocaleString()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Accordion.Item value={entry.id}>
      <Accordion.Control>
        <Group justify="space-between">
          <Text fw={500}>{tradeIdea}</Text>
          <Text size="sm" c="dimmed">
            {new Date(timestamp).toLocaleDateString()}
          </Text>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group justify="space-between" mb="md">
            <Text>Expected Value (EV):</Text>
            <Text fw={700} size="lg">${expectedValue.toFixed(2)}</Text>
        </Group>
        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Scenario</Table.Th>
              <Table.Th>Probability</Table.Th>
              <Table.Th>Outcome</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        
      </Accordion.Panel>
    </Accordion.Item>
  );
}

function LearningJournalPage() {
  const { journal } = useDecisionStore();

  if (journal.length === 0) {
    return (
      <Container>
        <Title order={1}>Learning Journal</Title>
        <Center mt="xl" style={{ height: '200px' }}>
          <Alert icon={<IconInfoCircle size="1rem" />} title="Your Journal is Empty" color="blue" radius="md">
            Go to the "Decision Workspace" to analyze a trade idea, then click "Save to Journal" to see your entries here.
          </Alert>
        </Center>
      </Container>
    );
  }

  return (
    <Container>
      <Title order={1}>Learning Journal</Title>
      <Text c="dimmed" mt="sm" mb="xl">
        Review your past decisions to identify patterns and improve your process.
      </Text>
      <Accordion variant="separated">
        {journal.map((entry) => (
          <JournalEntry key={entry.id} entry={entry} />
        ))}
      </Accordion>
    </Container>
  );
}

export default LearningJournalPage;