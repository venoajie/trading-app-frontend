
// src/pages/PortfolioDashboardPage/components/GoalModal.jsx
import { Modal, TextInput, NumberInput, Select, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useGoalsStore } from '../../../store/goalsStore';

export function GoalModal({ opened, onClose }) {
  const { addGoal, updateGoal, editingGoal } = useGoalsStore();

  const form = useForm({
    initialValues: {
      goal: '',
      progress: 0,
      strategy: '',
      effectiveness: 'Medium',
    },
    validate: {
      goal: (value) => (value.trim().length > 0 ? null : 'Goal name is required'),
      strategy: (value) => (value.trim().length > 0 ? null : 'Strategy is required'),
    },
  });

  // When the modal opens, populate the form if we are editing an existing goal
  useEffect(() => {
    if (editingGoal) {
      form.setValues(editingGoal);
    } else {
      form.reset();
    }
  }, [editingGoal, opened]);

  const handleSubmit = (values) => {
    if (editingGoal) {
      updateGoal({ ...editingGoal, ...values });
    } else {
      addGoal(values);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingGoal ? 'Edit Financial Goal' : 'Add New Financial Goal'}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Goal Name"
          placeholder="e.g., Retirement (2050)"
          required
          {...form.getInputProps('goal')}
        />
        <NumberInput
          label="Progress (%)"
          mt="md"
          min={0}
          max={100}
          required
          {...form.getInputProps('progress')}
        />
        <TextInput
          label="Strategy"
          placeholder="e.g., Long-Term Growth"
          mt="md"
          required
          {...form.getInputProps('strategy')}
        />
        <Select
          label="Effectiveness"
          data={['Low', 'Medium', 'High']}
          mt="md"
          required
          {...form.getInputProps('effectiveness')}
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button type="submit">{editingGoal ? 'Save Changes' : 'Add Goal'}</Button>
        </Group>
      </form>
    </Modal>
  );
}