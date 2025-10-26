
// src/pages/PortfolioDashboardPage/components/GoalManager.jsx
import { Table, RingProgress, Text, Group, Button, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useGoalsStore } from '../../../store/goalsStore';
import { GoalModal } from './GoalModal';

export function GoalManager() {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const { goals, setEditingGoal, deleteGoal } = useGoalsStore();

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    openModal();
  };

  const handleAddNew = () => {
    setEditingGoal(null); // Clear editing state for a new entry
    openModal();
  };

  const rows = goals.map((row) => (
    <Table.Tr key={row.id}>
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
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" onClick={() => handleEdit(row)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => deleteGoal(row.id)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <GoalModal opened={modalOpened} onClose={closeModal} />
      <Group justify="flex-end" mb="md">
        <Button onClick={handleAddNew}>Add Goal</Button>
      </Group>
      <Table mt="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Goal</Table.Th>
            <Table.Th>Progress</Table.Th>
            <Table.Th>Strategy</Table.Th>
            <Table.Th>Effectiveness</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}